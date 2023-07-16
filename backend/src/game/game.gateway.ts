import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';
import { WsocketGateway } from '../wsocket/wsocket.gateway';

import { UserInfo } from './dto/UserDto';
import { GameLogic } from './logic/game-logic';
import { Keys } from './logic/KeyAction';
import { OnShutdownCallback, PlayerData } from './types';
import { GameService } from './game.service';

@WebSocketGateway()
@UseFilters(new WsExceptionsFilter())
export class GameGateway {
  private userGameMap = new Map<string, GameLogic>();
  private waitingUser: PlayerData | undefined = undefined;

  constructor(
    private gameService: GameService,
    private server: WsocketGateway,
  ) {}

  handleConnection(client: Socket) {
    console.log('game connection');
    if (!client.handshake.auth.token) {
      return;
    }
    const userId = this.server.extractUserIdFromToken(
      client.handshake.auth.token,
    );
    if (!userId) {
      return;
    }
    this.userGameMap.get(userId)?.RebindSocket(userId, client);
  }

  handleDisconnect(client: Socket) {
    console.log('game handleDisconnect');
    if (!client.handshake.auth.token) {
      return;
    }
    const userId = this.server.extractUserIdFromToken(
      client.handshake.auth.token,
    );
    if (!userId || this.waitingUser?.data.id !== userId) {
      return;
    }
    this.waitingUser = undefined;
  }

  @SubscribeMessage('matchmake')
  matchmake(client: Socket, user: UserInfo) {
    console.log('matchmake', user.username);
    const reqUser: PlayerData = { client: client, data: user };
    if (this.userGameMap.has(user.id)) {
      client.emit('already playing');
      return;
    }
    if (!this.waitingUser) {
      console.log('waiting', reqUser.data.username);
      this.waitingUser = reqUser;
      return;
    }
    if (this.waitingUser.data.id === reqUser.data.id) {
      return;
    }

    const onShutdown: OnShutdownCallback = async (
      winnerUserId: string,
      loserUserId: string,
    ) => {
      console.log('onshutdown');
      this.userGameMap.delete(winnerUserId);
      this.userGameMap.delete(loserUserId);
      this.gameService.UpdateRating(winnerUserId, 'WIN');
      this.gameService.UpdateRating(loserUserId, 'LOSE');
    };

    const game = new GameLogic(this.waitingUser, reqUser, onShutdown);
    this.userGameMap.set(this.waitingUser.data.id, game);
    this.userGameMap.set(reqUser.data.id, game);

    reqUser.client.emit('matched', this.waitingUser.data.username);
    this.waitingUser.client.emit('matched', reqUser.data.username);
    this.waitingUser = undefined;
  }

  @SubscribeMessage('clear match')
  clearMatch(client: Socket, userId: string) {
    console.log('clearMatch');
    if (this.waitingUser?.data.id === userId) {
      console.log('to undefined waiter');
      this.waitingUser = undefined;
      return;
    }
  }

  @SubscribeMessage('start game')
  StartGame(client: Socket) {
    console.log('start game');
    const userid = this.server.getUserId(client);
    if (userid === undefined) {
      return;
    }
    this.userGameMap.get(userid)?.ReadyGame(client);
  }

  @SubscribeMessage('key press')
  handleKeyPress(client: Socket, key: Keys) {
    console.log('press', key);
    const userid = this.server.getUserId(client);
    if (userid === undefined) {
      return;
    }
    this.userGameMap.get(userid)?.HandleKeyPress(client, key);
  }

  @SubscribeMessage('key release')
  handleKeyRelease(client: Socket, key: Keys) {
    console.log('release', key);
    const userid = this.server.getUserId(client);
    if (userid === undefined) {
      return;
    }
    this.userGameMap.get(userid)?.HandleKeyRelease(client, key);
  }
}

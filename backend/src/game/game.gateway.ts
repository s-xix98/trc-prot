import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';
import { WsocketGateway } from '../wsocket/wsocket.gateway';
import { UserService } from '../user/user.service';

import { UserInfo } from './dto/UserDto';
import { GameLogic } from './logic/game-logic';
import { Keys } from './logic/KeyAction';
import {
  OnShutdownCallback,
  PlayerData,
  PlayerResult,
  ResultEvaluator,
} from './types';
import { GameService } from './game.service';
import { GameFactory } from './matching/types';
import { MatchingTable } from './matching/matching-table';
import { GameRoom } from './game-room';

@WebSocketGateway()
@UseFilters(new WsExceptionsFilter())
export class GameGateway {
  // TODO MatchinTableをシングルトンにしてDIしたい
  private matchingTable: MatchingTable = new MatchingTable();
  private gameRoom: GameRoom = new GameRoom();

  constructor(
    private gameService: GameService,
    private server: WsocketGateway,
    private user: UserService,
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
    this.gameRoom.getGame(userId)?.RebindSocket(userId, client);
  }

  handleDisconnect(client: Socket) {
    console.log('game handleDisconnect');
    if (!client.handshake.auth.token) {
      return;
    }
    const userId = this.server.extractUserIdFromToken(
      client.handshake.auth.token,
    );
    if (!userId) {
      return;
    }
    this.matchingTable.clearWaitingUser(userId);
    this.gameRoom.deleteInvitations(userId);
  }

  @SubscribeMessage('matchmake')
  matchmake(client: Socket, user: UserInfo) {
    console.log('matchmake', user.username);
    if (this.gameRoom.isPlaying(user.id)) {
      client.emit('error', 'already playing');
      return;
    }
    const players = this.matchingTable.matchmake({
      client: client,
      data: user,
    });
    if (!players) {
      return;
    }
    const { err } = this.gameRoom.add(players, this.CreateGameFactory());
    if (err !== null) {
      client.emit('error', err);
      return;
    }
    players.p1.client.emit('matched', players.p2.data.username);
    players.p2.client.emit('matched', players.p1.data.username);
  }

  @SubscribeMessage('clear match')
  clearMatch(client: Socket, userId: string) {
    console.log('clearMatch');
    this.matchingTable.clearWaitingUser(userId);
  }

  @SubscribeMessage('start game')
  StartGame(client: Socket) {
    console.log('start game');
    const userid = this.server.getUserId(client);
    if (userid === undefined) {
      return;
    }
    this.gameRoom.getGame(userid)?.ReadyGame(client);
  }

  @SubscribeMessage('invite game')
  async invite(client: Socket, dest: UserInfo) {
    const srcId = this.server.extractUserIdFromToken(
      client.handshake.auth.token,
    );
    if (!srcId) {
      return;
    }
    const src: UserInfo = await this.user.findOneById(srcId);
    const destSock = this.server.getSocket(dest.id);
    if (!destSock) {
      client.emit('error', `${dest.username} is not online`);
      return;
    }
    const { err } = this.gameRoom.invite(
      { src: src.id, dest: dest.id },
      this.CreateGameFactory(),
    );
    if (err !== null) {
      client.emit('error', err);
      return;
    }
    destSock.emit('receive game-invitation', src);
  }

  @SubscribeMessage('accept game-invitation')
  async acceptInvitation(client: Socket, srcUser: UserInfo) {
    const destId = this.server.extractUserIdFromToken(
      client.handshake.auth.token,
    );
    if (!destId) {
      return;
    }
    const destUser: UserInfo = await this.user.findOneById(destId);
    const srcSock = this.server.getSocket(srcUser.id);
    if (!srcSock) {
      client.emit('error', `${srcUser.username} is not online`);
      return;
    }
    const src: PlayerData = { client: srcSock, data: srcUser };
    const dest: PlayerData = { client, data: destUser };
    const { err } = this.gameRoom.acceptInvitation({ src, dest });
    if (err !== null) {
      client.emit('error', err);
      return;
    }
    this.matchingTable.clearWaitingUser(src.data.id);
    this.matchingTable.clearWaitingUser(dest.data.id);
    src.client.emit('matched', dest.data.username);
    dest.client.emit('matched', src.data.username);
  }

  @SubscribeMessage('deny game-invitation')
  denyInvitation(client: Socket, srcUser: UserInfo) {
    const dest = this.server.extractUserIdFromToken(
      client.handshake.auth.token,
    );
    if (!dest) {
      return;
    }
    this.gameRoom.denyInvitation({ src: srcUser.id, dest });
  }

  @SubscribeMessage('key press')
  handleKeyPress(client: Socket, key: Keys) {
    console.log('press', key);
    const userid = this.server.getUserId(client);
    if (userid === undefined) {
      return;
    }
    this.gameRoom.getGame(userid)?.HandleKeyPress(client, key);
  }

  @SubscribeMessage('key release')
  handleKeyRelease(client: Socket, key: Keys) {
    console.log('release', key);
    const userid = this.server.getUserId(client);
    if (userid === undefined) {
      return;
    }
    this.gameRoom.getGame(userid)?.HandleKeyRelease(client, key);
  }

  private CreateGameFactory(): GameFactory {
    const gameFactory: GameFactory = (
      player1: PlayerData,
      player2: PlayerData,
    ): GameLogic => {
      const onShutdown: OnShutdownCallback = async (
        p1Result: PlayerResult,
        p2Result: PlayerResult,
        resultEvaluator: ResultEvaluator,
      ) => {
        console.log('onshutdown');
        this.gameRoom.delete({ p1: p1Result.userId, p2: p2Result.userId });
        await this.gameService
          .saveGameResult(p1Result, p2Result, resultEvaluator)
          .catch((e) => console.log(e));
      };

      return new GameLogic(player1, player2, onShutdown);
    };

    return gameFactory;
  }
}

import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';
import { WsocketGateway } from '../wsocket/wsocket.gateway';

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
import { GameFactory, OnMatched } from './matching/types';
import { MatchingTable } from './matching/matching-table';

@WebSocketGateway()
@UseFilters(new WsExceptionsFilter())
export class GameGateway {
  // TODO MatchinTableをシングルトンにしてDIしたい
  private matchingTable: MatchingTable = new MatchingTable();

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
    this.matchingTable.getGame(userId)?.RebindSocket(userId, client);
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
  }

  @SubscribeMessage('matchmake')
  matchmake(client: Socket, user: UserInfo) {
    console.log('matchmake', user.username);
    if (this.matchingTable.isPlaying(user.id)) {
      client.emit('already playing');
      return;
    }

    const onMatched: OnMatched = (player1: PlayerData, player2: PlayerData) => {
      player1.client.emit('matched', player2.data.username);
      player2.client.emit('matched', player1.data.username);
    };

    this.matchingTable.matchmake(
      { client: client, data: user },
      this.CreateGameFactory(),
      onMatched,
    );
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
    this.matchingTable.getGame(userid)?.ReadyGame(client);
  }

  @SubscribeMessage('key press')
  handleKeyPress(client: Socket, key: Keys) {
    console.log('press', key);
    const userid = this.server.getUserId(client);
    if (userid === undefined) {
      return;
    }
    this.matchingTable.getGame(userid)?.HandleKeyPress(client, key);
  }

  @SubscribeMessage('key release')
  handleKeyRelease(client: Socket, key: Keys) {
    console.log('release', key);
    const userid = this.server.getUserId(client);
    if (userid === undefined) {
      return;
    }
    this.matchingTable.getGame(userid)?.HandleKeyRelease(client, key);
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
        this.matchingTable.deleteGame(p1Result.userId, p2Result.userId);
        await this.gameService
          .saveGameResult(p1Result, p2Result, resultEvaluator)
      };

      return new GameLogic(player1, player2, onShutdown);
    };

    return gameFactory;
  }
}

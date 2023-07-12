import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';

import { UserInfo } from './dto/UserDto';
import { GameLogic } from './logic/game-logic';
import { Keys } from './logic/KeyAction';

enum PlaySide {
  LEFT = 0,
  RIGHT = 1,
}

type PlayerData = { client: Socket; data: UserInfo };

@WebSocketGateway()
@UseFilters(new WsExceptionsFilter())
export class GameGateway {
  private matchedUsers = new Map<string, UserInfo>();
  private userGameMap = new Map<string, GameLogic>();
  private userSockMap = new Map<string, Socket>();
  private sockUserMap = new Map<string, string>();
  private waitingUser: PlayerData | undefined = undefined;

  private game: GameLogic | undefined;

  handleConnection() {
    console.log('game connection');
  }

  handleDisconnect(client: Socket) {
    console.log('game handleDisconnect');
    const selfUserId = this.sockUserMap.get(client.id);
    if (selfUserId === undefined) {
      return;
    }
    const enemyUser = this.matchedUsers.get(selfUserId);
    if (enemyUser === undefined) {
      // NotReach
      return;
    }
    const enemySocket = this.userSockMap.get(enemyUser.id);
    if (enemySocket === undefined) {
      // NotReach
      return;
    }
    enemySocket.emit('enemy disconnected');

    console.log('delete match data');
    this.matchedUsers.delete(selfUserId);
    this.matchedUsers.delete(enemyUser.id);

    // TODO とりあえずどちらか一方でもDCしたら即終了して削除してる
    //  あとあとディスコネした方のペナルティとかに変えたい　変えないかもだけど
    this.userGameMap.get(selfUserId)?.EndGame();
    this.userGameMap.delete(selfUserId);
    this.userGameMap.delete(enemyUser.id);

    this.userSockMap.delete(selfUserId);
    this.userSockMap.delete(enemyUser.id);

    this.sockUserMap.delete(client.id);
    this.sockUserMap.delete(enemySocket.id);

    this.game?.EndGame();
    this.game = undefined;
  }

  @SubscribeMessage('matchmake')
  matchmake(client: Socket, user: UserInfo) {
    console.log('matchmake', user.username);
    if (this.matchedUsers.has(user.id)) {
      client.emit('already playing');
      return;
    }
    if (!this.waitingUser || this.waitingUser.data.id === user.id) {
      console.log('waiting', user.username);
      this.waitingUser = { client: client, data: user };
      return;
    }
    this.matchedUsers.set(this.waitingUser.data.id, user);
    this.matchedUsers.set(user.id, this.waitingUser.data);

    const game = new GameLogic(this.waitingUser.client, client);
    this.userGameMap.set(this.waitingUser.data.id, game);
    this.userGameMap.set(user.id, game);

    this.userSockMap.set(this.waitingUser.data.id, this.waitingUser.client);
    this.sockUserMap.set(this.waitingUser.client.id, this.waitingUser.data.id);

    this.userSockMap.set(user.id, client);
    this.sockUserMap.set(client.id, user.id);

    this.waitingUser.client.emit('matched', PlaySide.LEFT, user.username);
    client.emit('matched', PlaySide.RIGHT, this.waitingUser.data.username);
    this.waitingUser = undefined;
  }

  @SubscribeMessage('clear match')
  clearMatch(client: Socket, userId: string) {
    console.log('clearMatch');
    if (this.waitingUser?.data.id === userId) {
      this.waitingUser = undefined;
      console.log('to undefined waiter');
      return;
    }
    if (!this.matchedUsers.has(userId)) {
      return;
    }
    const sock = this.userSockMap.get(userId);
    if (sock === undefined) {
      // NotReach
      return;
    }
    const enemyUser = this.matchedUsers.get(userId);
    if (enemyUser === undefined) {
      // NotReach
      return;
    }
    const enemySocket = this.userSockMap.get(enemyUser.id);
    if (enemySocket === undefined) {
      // NotReach
      return;
    }
    console.log(this.matchedUsers.delete(userId));
    console.log(this.matchedUsers.delete(enemyUser.id));

    console.log(this.userSockMap.delete(userId));
    console.log(this.userSockMap.delete(enemyUser.id));

    console.log(this.sockUserMap.delete(sock.id));
    console.log(this.sockUserMap.delete(enemySocket.id));
  }

  @SubscribeMessage('start game')
  StartGame(client: Socket) {
    console.log('create game');
    if (this.game) {
      return;
    }
    // 一旦同じクライアントを登録。マルチプレイ対応したら直す
    this.game = new GameLogic(client, client);
    this.game.StartGame();
  }

  @SubscribeMessage('end game')
  EndGame() {
    console.log('end game');
    this.game?.EndGame();
    this.game = undefined;
  }

  @SubscribeMessage('key press')
  handleKeyPress(client: Socket, key: Keys) {
    console.log('press', key);
    this.game?.HandleKeyPress(key);
  }

  @SubscribeMessage('key release')
  handleKeyRelease(client: Socket, key: Keys) {
    console.log('release', key);
    this.game?.HandleKeyRelease(key);
  }
}

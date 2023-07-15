import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';
import { WsocketGateway } from '../wsocket/wsocket.gateway';

import { UserInfo } from './dto/UserDto';
import { GameLogic } from './logic/game-logic';
import { Keys } from './logic/KeyAction';
import { OnShutdownCallback, PlayerData } from './types';

enum PlaySide {
  LEFT = 0,
  RIGHT = 1,
}

const UpdateRatingTable = async (
  winner: string,
  loser: string,
  prisma: PrismaService,
) => {
  await prisma.rating.upsert({
    where: {
      userId: winner,
    },
    update: {
      rating: { increment: 1 },
    },
    create: {
      userId: winner,
      rating: 1,
    },
  });

  await prisma.rating.upsert({
    where: {
      userId: loser,
    },
    update: {
      rating: { increment: -1 },
    },
    create: {
      userId: loser,
      rating: -1,
    },
  });
};

@WebSocketGateway()
@UseFilters(new WsExceptionsFilter())
export class GameGateway {
  private matchedUsers = new Map<string, UserInfo>();
  private userGameMap = new Map<string, GameLogic>();
  private waitingUser: PlayerData | undefined = undefined;

  constructor(private prisma: PrismaService, private server: WsocketGateway) {}

  handleConnection() {
    console.log('game connection');
  }

  handleDisconnect(client: Socket) {
    console.log('game handleDisconnect');
    const selfUserId = this.server.getUserId(client);
    if (selfUserId === undefined) {
      return;
    }
    const enemyUser = this.matchedUsers.get(selfUserId);
    if (enemyUser === undefined) {
      // NotReach
      return;
    }
    const enemySocket = this.server.getSocket(enemyUser.id);
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
  }

  @SubscribeMessage('matchmake')
  matchmake(client: Socket, user: UserInfo) {
    console.log('matchmake', user.username);
    if (this.userGameMap.has(user.id)) {
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

    const onShutdown: OnShutdownCallback = async (
      winnerUserId: string,
      loserUserId: string,
    ) => {
      console.log('onshutdown');
      UpdateRatingTable(winnerUserId, loserUserId, this.prisma);
    };

    const game = new GameLogic(this.waitingUser, { client: client, data: user }, onShutdown,);
    this.userGameMap.set(this.waitingUser.data.id, game);
    this.userGameMap.set(user.id, game);

    client.emit('matched', PlaySide.RIGHT, this.waitingUser.data.username);
    this.waitingUser.client.emit('matched', PlaySide.LEFT, user.username);
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

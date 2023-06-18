import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { UserInfo } from './dto/UserDto';

enum PlaySide {
  LEFT = 0,
  RIGHT = 1,
}

type PlayerData = { client: Socket; data: UserInfo };

@WebSocketGateway()
export class GameGateway {
  private matchedUsers = new Map<string, UserInfo>();
  private waitingUser: PlayerData | undefined = undefined;

  handleConnection() {
    console.log('game connection');
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

    this.waitingUser.client.emit('matched', PlaySide.LEFT, user.username);
    client.emit('matched', PlaySide.RIGHT, this.waitingUser.data.username);
    this.waitingUser = undefined;
  }
}

import { WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';

import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';
import { AuthService } from '../auth/auth.service';

import { generatePrefixedId, roomType } from './utils';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(new WsExceptionsFilter())
export class WsocketGateway {
  @WebSocketServer()
  server: Server;
  private socketMap: Map<Socket, string> = new Map();
  private userMap: Map<string, Socket> = new Map();

  constructor(private auth: AuthService) {}

  async handleConnection(client: Socket) {
    console.log('handleConnection ws gateway', client.id);

    const token = client.handshake.auth.token;
    if (token === undefined) {
      client.emit('logout');
      client.disconnect();
      return;
    }

    try {
      const payload = await this.auth.verifyJwt(token);

      const oldClient = this.userMap.get(payload.userId);
      if (oldClient !== undefined) {
        oldClient.emit('logout');
        oldClient.disconnect();
        this.socketMap.delete(oldClient);
        this.userMap.delete(payload.userId);
      }

      this.socketMap.set(client, payload.userId);
      this.userMap.set(payload.userId, client);
    } catch (err) {
      console.log(err);
      client.emit('logout');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('handleDisconnect ws gateway', client.id);

    const userId = this.socketMap.get(client);

    if (userId !== undefined) {
      this.socketMap.delete(client);
      this.userMap.delete(userId);
    }
  }

  JoinRoom(client: Socket, prefix: roomType, id: string) {
    const prefixedId = generatePrefixedId(prefix, id);
    client.join(prefixedId);
  }

  LeaveRoom(client: Socket, prefix: roomType, id: string) {
    const prefixedId = generatePrefixedId(prefix, id);
    client.leave(prefixedId);
  }

  to(prefix: roomType, id: string) {
    const prefixedId = generatePrefixedId(prefix, id);
    return this.server.to(prefixedId);
  }

  getSocket(userId: string) {
    return this.userMap.get(userId);
  }

  getUserId(client: Socket) {
    return this.socketMap.get(client);
  }

  extractUserIdFromToken(token: string): string | null {
    const decoded = this.auth.decodeJwt(token);

    if (
      decoded !== null &&
      typeof decoded === 'object' &&
      'userId' in decoded
    ) {
      return decoded.userId;
    }

    return null;
  }
}

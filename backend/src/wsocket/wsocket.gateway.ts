import { WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { UseFilters } from '@nestjs/common';

import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';

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
}

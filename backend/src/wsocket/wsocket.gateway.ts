import { WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

import { generatePrefixedId, socketNamespaceType } from './utils';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WsocketGateway {
  @WebSocketServer()
  server: Server;

  socketJoinRoom(client: Socket, prefix: socketNamespaceType, id: string) {
    const prefixedId = generatePrefixedId(prefix, id);
    client.join(prefixedId);
  }

  socketLeaveRoom(
    client: Socket,
    prefix: socketNamespaceType,
    id: string,
  ) {
    const prefixedId = generatePrefixedId(prefix, id);
    client.leave(prefixedId);
  }

  to(prefix: socketNamespaceType, id: string) {
    const prefixedId = generatePrefixedId(prefix, id);
    return this.server.to(prefixedId);
  }
}

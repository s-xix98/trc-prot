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

  socketJoinNamespace(client: Socket, prefix: socketNamespaceType, id: string) {
    const prefixedId = generatePrefixedId(prefix, id);
    client.join(prefixedId);
  }

  socketLeaveNamespace(
    client: Socket,
    prefix: socketNamespaceType,
    id: string,
  ) {
    const prefixedId = generatePrefixedId(prefix, id);
    client.leave(prefixedId);
  }
}

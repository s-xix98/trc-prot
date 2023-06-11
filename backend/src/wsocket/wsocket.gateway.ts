import { WebSocketGateway } from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class WsocketGateway {
  @WebSocketServer()
  server: Server;

  }
}

import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {

  handleConnection(client: Socket) {
    console.log('chat Connection');
  }
  handleDisconnect(client: Socket) {
    console.log('chat Disconnection');
  }
}

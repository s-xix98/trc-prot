import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateway {
  constructor(private prisma: PrismaService) {}
  handleConnection(client: Socket) {
    console.log('handleConnection', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('handleDisconnect', client.id);
  }

  @SubscribeMessage('searchUser')
  searchUser(client: Socket) {
    console.log('searchUser', client.id);

  }
}

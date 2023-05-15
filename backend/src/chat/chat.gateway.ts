import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private prisma: PrismaService) {}
  handleConnection(client: Socket) {
    console.log('chat Connection');
  }
  handleDisconnect(client: Socket) {
    console.log('chat Disconnection');
  }
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket) {
    await this.prisma.message.create({
      data: {
        content: 'test',
        userId: 1,
        chatRoomId: 1,
      },
    });
  }
}

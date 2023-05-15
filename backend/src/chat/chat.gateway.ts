import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket,Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { MessageDto } from './dto/message.dto';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(private prisma: PrismaService) {}
  handleConnection(client: Socket) {
    console.log('chat Connection');
  }
  handleDisconnect(client: Socket) {
    console.log('chat Disconnection');
  }
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, messageDto: MessageDto) {
    const msg = await this.prisma.message.create({
      data: {
        content: messageDto.content,
        userId: messageDto.userId,
        chatRoomId: messageDto.chatRoomId,
      },
    });
    this.server.emit('sendMessage', msg);
  }
}

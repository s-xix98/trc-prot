import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { PrismaService } from '../prisma/prisma.service';

import { handleMessageDto } from './dto/event.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private prisma: PrismaService) {}

  wsClients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    console.log('handleConnection');
    // TODO : assert cliend id has
    this.wsClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log('handleDisconnect');
    this.wsClients.delete(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: handleMessageDto): string {
    console.log('message', payload);
    for (const c of this.wsClients.values()) {
      c.emit('message', payload);
    }
    return 'Hello world!';
  }

  @SubscribeMessage('getPastMessages')
  async handleGetPastMessages(client: Socket, authorId: string) {
    console.log('getPastMessages');
    // Userテーブルのidでそのuserのmsgデータを全て取得
    const pastMessages = await this.prisma.message.findMany({
      where: {
        userId: authorId,
      },
    });
    console.log('mid', authorId);
    const user = await this.prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
    console.log(user);
    client.emit(
      'getPastMessages',
      pastMessages.map((m) => {
        return {
          nickname: user?.username,
          msg: m.content,
        };
      }),
    );
  }
}

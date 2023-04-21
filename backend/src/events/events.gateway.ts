import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

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
  handleMessage(client: Socket, payload: string): string {
    console.log('message', payload);
    for (const c of this.wsClients.values()) {
      c.emit('message', `${client.id.substring(0, 4)} > ${payload}`);
    }
    return 'Hello world!';
  }

  @SubscribeMessage('getPastMessages')
  async handleGetPastMessages(client: Socket, authorId: number) {
    console.log('getPastMessages');
    // Userテーブルのidでそのuserのmsgデータを全て取得
    const pastMessages = await this.prisma.message.findMany({
      where: {
        authorId,
      },
    });
    client.emit(
      'getPastMessages',
      pastMessages.map((msg) => msg.content),
    );
  }
}

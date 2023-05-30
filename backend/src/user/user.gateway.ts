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
  // TODO　エラー処理はしていない
  @SubscribeMessage('searchUser')
  async searchUser(client: Socket) {
    console.log('searchUser', client.id);
    const mockData = {
      searchWord: 'mockWord',
    };
    const partialMatchUsers = await this.prisma.user.findMany({
      where: {
        username: {
          contains: mockData.searchWord,
          mode: 'insensitive',
        },
      },
    });
    console.log(partialMatchUsers);
  }
}

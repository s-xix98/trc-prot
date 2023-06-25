import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { PrismaService } from '../prisma/prisma.service';

import { searchUserDto } from './dto/user.dto';
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
  async searchUser(client: Socket, dto: searchUserDto) {
    console.log('searchUser', client.id);
    const partialMatchUsers = await this.prisma.user.findMany({
      where: {
        username: {
          contains: dto.searchWord,
          mode: 'insensitive',
        },
      },
    });
    console.log(partialMatchUsers);
    client.emit('searchUser', partialMatchUsers);
  }

  @SubscribeMessage('friendRequest')
  async friendRequest(client: Socket) {
    console.log('friendRequest', client.id);
  }
}

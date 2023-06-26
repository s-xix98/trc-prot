import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { PrismaService } from '../prisma/prisma.service';

import { searchUserDto } from './dto/user.dto';
import { friendshipDto } from './dto/friendship.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateway {
  constructor(private prisma: PrismaService) {}
  async handleConnection(client: Socket) {
    console.log('handleConnection', client.id);

    // 接続時にfriendRequestをfrontに送る。
    // 現状接続してきたuserのidを取得できないからhugaへのfriendRequestを送る
    const huga = await this.prisma.user.findUnique({where: {username: 'huga'}});
    const piyo = await this.prisma.user.findUnique({where: {username: 'piyo'}});

    if (!huga || !piyo) {
      return;
    }

    await this.prisma.friendship.upsert({
      where: {
        srcUserId_destUserId: {
          srcUserId: piyo.id,
          destUserId: huga.id,
        },
      },
      update: {},
      create: {
        srcUserId: piyo.id,
        destUserId: huga.id,
        status: 'Requested',
      },
    });

    const friendRequests = await this.prisma.friendship.findMany({
      where: {
        destUserId: huga.id,
      },
    });

    client.emit('friendRequest', friendRequests);
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
  async friendRequest(client: Socket, dto: friendshipDto) {
    console.log('friendRequest', client.id);
    console.log(dto);

    await this.prisma.friendship.create({
      data: {
        srcUserId: dto.userId,
        destUserId: dto.targetId,
        status: 'Requested',
      },
    });
    // TODO targetユーザーに通知を送る
    // client.to(target client id).emit('friendRequest', userid , username);
  }
}

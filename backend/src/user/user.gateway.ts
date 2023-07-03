import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { map, pick } from 'lodash';
import { UseFilters } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';

import { searchUserDto } from './dto/user.dto';
import { friendshipDto } from './dto/friendship.dto';
import { UserService } from './user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(new WsExceptionsFilter())
export class UserGateway {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    console.log('handleConnection', client.id);

    // 接続時にfriendRequestをfrontに送る。
    // 現状接続してきたuserのidを取得できないからhugaへのfriendRequestを送る
    const huga = await this.prisma.user.findUnique({
      where: { username: 'huga' },
    });
    const piyo = await this.prisma.user.findUnique({
      where: { username: 'piyo' },
    });

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
      include: {
        srcUser: true,
      },
      where: {
        destUserId: huga.id,
      },
    });

    const sender = map(friendRequests, 'srcUser');
    client.emit(
      'friendRequest',
      map(sender, (user) => pick(user, 'id', 'username')),
    );
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

    if (dto.userId === dto.targetId) {
      throw new Error('cannot send friend request to yourself');
    }

    const { srcFriendship, targetFriendship } =
      await this.userService.getFriendship(dto.userId, dto.targetId);

    if (
      srcFriendship?.status === 'Blocked' ||
      targetFriendship?.status === 'Blocked'
    ) {
      throw new Error('cannot send friend request to blocked user');
    } else if (targetFriendship?.status === 'Accepted') {
      throw new Error('already friend');
    } else if (srcFriendship?.status === 'Requested') {
      throw new Error('already requested');
    } else if (targetFriendship?.status === 'Requested') {
      await this.userService.upsertFriendship(
        dto.userId,
        dto.targetId,
        'Accepted',
      );
      await this.userService.upsertFriendship(
        dto.targetId,
        dto.userId,
        'Accepted',
      );
    } else if (srcFriendship === null) {
      await this.userService.upsertFriendship(
        dto.userId,
        dto.targetId,
        'Requested',
      );
      // TODO targetユーザーに通知を送る
      // client.to(target client id).emit('friendRequest', userid , username);
    }
  }

  @SubscribeMessage('blockUser')
  async blockUser(client: Socket, dto: friendshipDto) {
    console.log('blockUser', client.id, dto);

    if (dto.userId === dto.targetId) {
      throw new Error('cannot block yourself');
    }

    const relation = await this.userService.upsertFriendship(
      dto.userId,
      dto.targetId,
      'Blocked',
    );

    console.log(relation);

    // 相手がフレンドorリクエストの場合はレコードから削除する
    const { count } = await this.prisma.friendship.deleteMany({
      where: {
        srcUserId: dto.targetId,
        destUserId: dto.userId,
        status: {
          in: ['Requested', 'Accepted'],
        },
      },
    });
    console.log(count);

    if (count > 0) {
      client.emit('deleteFriendRequest', dto.targetId);
    }
    // TODO チャットmsgを非表示にする
  }
}

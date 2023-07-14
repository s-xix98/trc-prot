import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';
import { WsocketGateway } from '../wsocket/wsocket.gateway';

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
    private server: WsocketGateway,
  ) {}

  async handleConnection(client: Socket) {
    console.log('handleConnection', client.id);

    // 接続時にfriendRequestをfrontに送る。
    const userId = this.server.extractUserIdFromToken(client);
    if (!userId) {
      return;
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return;
    }

    const blockUsers = await this.userService.getBlockUsers(userId);
    const friends = await this.userService.getFriends(userId);
    const friendRequests = await this.userService.getFriendRequests(userId);

    client.emit('blockUsers', blockUsers);
    client.emit('friends', friends);
    client.emit('friendRequests', friendRequests);
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

  @SubscribeMessage('unblockUser')
  async unblockUser(client: Socket, dto: friendshipDto) {
    console.log('unblockUser', client.id, dto);

    if (dto.userId === dto.targetId) {
      throw new Error('cannot unblock yourself');
    }

    const { count } = await this.prisma.friendship.deleteMany({
      where: {
        srcUserId: dto.userId,
        destUserId: dto.targetId,
        status: {
          equals: 'Blocked',
        },
      },
    });

    if (count > 0) {
      const blockUsers = await this.userService.getBlockUsers(dto.userId);
      // TODO 非表示だったmsgを表示する
      client.emit('blockUsers', blockUsers);
    }
  }

  @SubscribeMessage('unfriendUser')
  async unfriendUser(client: Socket, dto: friendshipDto) {
    console.log('unfriendUser', client.id, dto);

    if (dto.userId === dto.targetId) {
      throw new Error('cannot unblock yourself');
    }

    const { count } = await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          {
            srcUserId: dto.userId,
            destUserId: dto.targetId,
            status: {
              equals: 'Accepted',
            },
          },
          {
            srcUserId: dto.targetId,
            destUserId: dto.userId,
            status: {
              equals: 'Accepted',
            },
          },
        ],
      },
    });

    if (count > 0) {
      const friends = await this.userService.getFriends(dto.userId);
      // TODO 相手のフレンドリストからも削除する
      client.emit('friends', friends);
    }
  }
}

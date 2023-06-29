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
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
    console.log('tramae', client.id);
    await this.prisma.$transaction(async (tx) => {
      await sleep(1000);
      console.log('trastart', client.id);

      const srcFriendship = await tx.friendship.findUnique({
        where: {
          srcUserId_destUserId: {
            srcUserId: dto.userId,
            destUserId: dto.targetId,
          },
        },
      });
      const targetFriendship = await tx.friendship.findUnique({
        where: {
          srcUserId_destUserId: {
            srcUserId: dto.targetId,
            destUserId: dto.userId,
          },
        },
      });

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
        await tx.friendship.upsert({
          where: {
            srcUserId_destUserId: {
              srcUserId: dto.targetId,
              destUserId: dto.userId,
            },
          },
          update: {
            status: 'Accepted',
          },
          create: {
            srcUserId: dto.targetId,
            destUserId: dto.userId,
            status: 'Accepted',
          },
        });

        await tx.friendship.upsert({
          where: {
            srcUserId_destUserId: {
              srcUserId: dto.userId,
              destUserId: dto.targetId,
            },
          },
          update: {
            status: 'Accepted',
          },
          create: {
            srcUserId: dto.userId,
            destUserId: dto.targetId,
            status: 'Accepted',
          },
        });

      } else if (srcFriendship === null) {
        await tx.friendship.upsert({
          where: {
            srcUserId_destUserId: {
              srcUserId: dto.userId,
              destUserId: dto.targetId,
            },
          },
          update: {
            status: 'Requested',
          },
          create: {
            srcUserId: dto.userId,
            destUserId: dto.targetId,
            status: 'Requested',
          },
        });
        console.log('traend', client.id);
        // TODO targetユーザーに通知を送る
        // client.to(target client id).emit('friendRequest', userid , username);
      }
      console.log('traato', client.id);
    });
  }

  @SubscribeMessage('blockUser')
  async blockUser(client: Socket, dto: friendshipDto) {
    console.log('blockUser', client.id, dto);

    const relation = await this.prisma.friendship.upsert({
      where: {
        srcUserId_destUserId: {
          srcUserId: dto.userId,
          destUserId: dto.targetId,
        },
      },
      update: {
        status: 'Blocked',
      },
      create: {
        srcUserId: dto.userId,
        destUserId: dto.targetId,
        status: 'Blocked',
      },
    });

    console.log(relation);

    // 相手がフレンドorリクエストの場合はレコードから削除する
    const targetRelation = await this.prisma.friendship.findUnique({
      where: {
        srcUserId_destUserId: {
          srcUserId: dto.targetId,
          destUserId: dto.userId,
        },
      },
    });

    if (
      targetRelation?.status === 'Accepted' ||
      targetRelation?.status === 'Requested'
    ) {
      await this.prisma.friendship.delete({
        where: {
          srcUserId_destUserId: {
            srcUserId: dto.targetId,
            destUserId: dto.userId,
          },
        },
      });
    }
    // TODO targetがフレンドだった場合targetのフレンドリストからdbとフロントから削除しチャットmsgを非表示にする
  }
}

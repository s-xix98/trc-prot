import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';
import { WsocketGateway } from '../wsocket/wsocket.gateway';
import { ChatGateway } from '../chat/chat.gateway';
import { CustomException } from '../exceptions/custom.exception';

import { UserProfileDto, searchUserDto } from './dto/user.dto';
import { friendshipDto } from './dto/friendship.dto';
import { UserService } from './user.service';
import { GameGateway } from 'src/game/game.gateway';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(new WsExceptionsFilter())
@UsePipes(new ValidationPipe())
export class UserGateway {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private chatGateway: ChatGateway,
    private server: WsocketGateway,
    private gameGateway: GameGateway,
  ) {}

  async handleConnection(client: Socket) {
    console.log('handleConnection', client.id);

    const token = client.handshake.auth.token;
    if (!token) {
      return;
    }

    // 接続時にfriendRequestをfrontに送る。
    const userId = this.server.extractUserIdFromToken(token);
    if (!userId) {
      return;
    }
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return;
      }

      await this.userService.updateUserState(userId, 'ONLINE');
      await this.broadcastFriends(userId);

      await this.sendBlockUsers(userId);
      await this.sendFriends(userId);
      await this.sendFriendRequests(userId);
    } catch (e) {
      console.log(e);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('handleDisconnect', client.id);
    const token = client.handshake.auth.token;
    if (!token) {
      return;
    }

    const userId = this.server.extractUserIdFromToken(token);
    if (!userId) {
      return;
    }

    try {
      await this.userService.updateUserState(userId, 'OFFLINE');
      await this.broadcastFriends(userId);
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserState(userId: string, state: UserState) {
    try {
      const isPlaying = await this.gameGateway.isPlayingBy(userId);
      // game中にonlineにならないように
      if (isPlaying && state === 'ONLINE') {
        return;
      }

      await this.userService.updateUserState(userId, state);
    } catch (error) {
      console.log(error);
    } finally {
      await this.broadcastFriends(userId);
    }
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
    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    if (userId === dto.targetId) {
      throw new CustomException('cannot send friend request to yourself');
    }

    const { srcFriendship, targetFriendship } =
      await this.userService.getFriendship(userId, dto.targetId);

    if (
      srcFriendship?.status === 'Blocked' ||
      targetFriendship?.status === 'Blocked'
    ) {
      throw new CustomException('cannot send friend request to blocked user');
    } else if (targetFriendship?.status === 'Accepted') {
      throw new CustomException('already friend');
    } else if (srcFriendship?.status === 'Requested') {
      throw new CustomException('already requested');
    } else if (targetFriendship?.status === 'Requested') {
      await this.userService.upsertFriendship(userId, dto.targetId, 'Accepted');
      await this.userService.upsertFriendship(dto.targetId, userId, 'Accepted');

      await this.sendFriends(userId);
      await this.sendFriends(dto.targetId);
      await this.sendFriendRequests(userId);
      await this.sendFriendRequests(dto.targetId);
    } else if (srcFriendship === null) {
      await this.userService.upsertFriendship(
        userId,
        dto.targetId,
        'Requested',
      );

      await this.sendFriendRequests(dto.targetId);
    }
  }

  @SubscribeMessage('blockUser')
  async blockUser(client: Socket, dto: friendshipDto) {
    console.log('blockUser', client.id, dto);

    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    if (userId === dto.targetId) {
      throw new CustomException('cannot block yourself');
    }

    const relation = await this.userService.upsertFriendship(
      userId,
      dto.targetId,
      'Blocked',
    );

    console.log(relation);

    // 相手がフレンドorリクエストの場合はレコードから削除する
    const { count } = await this.prisma.friendship.deleteMany({
      where: {
        srcUserId: dto.targetId,
        destUserId: userId,
        status: {
          in: ['Requested', 'Accepted'],
        },
      },
    });
    console.log(count);

    await this.sendBlockUsers(userId);
    await this.sendFriends(userId);
    await this.sendFriendRequests(userId);

    if (count > 0) {
      await this.sendFriends(dto.targetId);
    }
    // TODO チャットmsgを非表示にする
  }

  @SubscribeMessage('unblockUser')
  async unblockUser(client: Socket, dto: friendshipDto) {
    console.log('unblockUser', client.id, dto);
    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    if (userId === dto.targetId) {
      throw new CustomException('cannot unblock yourself');
    }

    const { count } = await this.prisma.friendship.deleteMany({
      where: {
        srcUserId: userId,
        destUserId: dto.targetId,
        status: {
          equals: 'Blocked',
        },
      },
    });

    if (count > 0) {
      await this.sendBlockUsers(userId);
      // TODO 非表示だったmsgを表示する
    }
  }

  @SubscribeMessage('unfriendUser')
  async unfriendUser(client: Socket, dto: friendshipDto) {
    console.log('unfriendUser', client.id, dto);
    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    if (userId === dto.targetId) {
      throw new CustomException('cannot unblock yourself');
    }

    const { count } = await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          {
            srcUserId: userId,
            destUserId: dto.targetId,
            status: {
              equals: 'Accepted',
            },
          },
          {
            srcUserId: dto.targetId,
            destUserId: userId,
            status: {
              equals: 'Accepted',
            },
          },
        ],
      },
    });

    if (count > 0) {
      await this.sendFriends(userId);
      await this.sendFriends(dto.targetId);
    }
  }

  @SubscribeMessage('updateProfile')
  async updateProfile(client: Socket, dto: UserProfileDto) {
    console.log('updateProfile', dto);

    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('invalid token');
    }

    await this.userService.updateUser(userId, dto);
    const user = await this.userService.findOneById(userId);

    client.emit('profile', user);

    await Promise.all([
      this.broadcastFriends(userId),
      this.broadcastBlockers(userId),
      this.broadcastSentRequests(userId),
      this.chatGateway.broadcastMessagesToJoinedRooms(userId),
    ]);
  }

  private async sendFriendRequests(userId: string) {
    const sock = this.server.getSocket(userId);
    if (sock === undefined) {
      return;
    }

    const friendRequests = await this.userService.getFriendRequests(userId);
    sock.emit('friendRequests', friendRequests);
  }

  private async sendFriends(userId: string) {
    const sock = this.server.getSocket(userId);
    if (sock === undefined) {
      return;
    }

    const friends = await this.userService.getFriends(userId);
    sock.emit('friends', friends);
  }

  private async sendBlockUsers(userId: string) {
    const sock = this.server.getSocket(userId);
    if (sock === undefined) {
      return;
    }

    const blockUsers = await this.userService.getBlockUsers(userId);
    sock.emit('blockUsers', blockUsers);
  }

  private async broadcastSentRequests(userId: string) {
    const requests = await this.userService.getSentFriendRequests(userId);
    await Promise.all(
      requests.map(async (req) => {
        this.sendFriendRequests(req.destUserId);
      }),
    );
  }

  private async broadcastBlockers(userId: string) {
    const users = await this.userService.getUsersWhoBlockedUser(userId);
    await Promise.all(
      users.map(async (user) => {
        this.sendBlockUsers(user.id);
      }),
    );
  }

  private async broadcastFriends(userId: string) {
    const friends = await this.userService.getFriends(userId);
    await Promise.all(
      friends.map(async (user) => {
        this.sendFriends(user.id);
      }),
    );
  }
}

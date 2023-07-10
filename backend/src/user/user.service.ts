import { Injectable, ForbiddenException } from '@nestjs/common';
import { FriendshipStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { UserInfo } from './types/userInfo';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }
    return user;
  }

  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }
    return user;
  }

  async search(searchWord: string, userId: string) {
    const partialMatchUsers = await this.prisma.user.findMany({
      where: {
        username: {
          contains: searchWord,
          mode: 'insensitive',
        },
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        username: true,
        friendship2: {
          select: {
            status: true,
          },
          where: {
            srcUserId: userId,
          },
        },
      },
    });

    return partialMatchUsers.map(this.extractFriendshipStatus);
  }

  async getFriendship(userId: string, targetId: string) {
    const srcFriendship = await this.prisma.friendship.findUnique({
      where: {
        srcUserId_destUserId: {
          srcUserId: userId,
          destUserId: targetId,
        },
      },
    });

    const targetFriendship = await this.prisma.friendship.findUnique({
      where: {
        srcUserId_destUserId: {
          srcUserId: targetId,
          destUserId: userId,
        },
      },
    });

    return { srcFriendship, targetFriendship };
  }

  async upsertFriendship(
    userId: string,
    targetId: string,
    status: 'Accepted' | 'Blocked' | 'Requested',
  ) {
    const friendship = await this.prisma.friendship.upsert({
      where: {
        srcUserId_destUserId: {
          srcUserId: userId,
          destUserId: targetId,
        },
      },
      update: {
        status: status,
      },
      create: {
        srcUserId: userId,
        destUserId: targetId,
        status: status,
      },
    });
    return friendship;
  }

  async getFriends(userId: string): Promise<UserInfo[]> {
    const friends = await this.prisma.friendship.findMany({
      where: {
        srcUserId: userId,
        status: {
          equals: 'Accepted',
        },
      },
      include: {
        destUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    const friendsUserInfo = friends.map((f) => {
      const { username, id } = f.destUser;
      return { username, id, status: FriendshipStatus.Accepted };
    });

    return friendsUserInfo;
  }

  async getBlockUsers(userId: string): Promise<UserInfo[]> {
    const blocks = await this.prisma.friendship.findMany({
      where: {
        srcUserId: userId,
        status: {
          equals: 'Blocked',
        },
      },
      include: {
        destUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    const blocksUserInfo = blocks.map((b) => {
      const { username, id } = b.destUser;
      return { username, id, status: FriendshipStatus.Blocked };
    });

    return blocksUserInfo;
  }

  extractFriendshipStatus(user: {
    id: string;
    username: string;
    friendship2: {
      status: FriendshipStatus;
    }[];
  }): UserInfo {
    const { friendship2, ...userWithoutFriendship } = user;

    return {
      ...userWithoutFriendship,
      status: friendship2.length > 0 ? friendship2[0].status : undefined,
    };
  }
}

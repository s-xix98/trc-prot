import { Injectable, ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { UserProfileDto } from './dto/user.dto';
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
        base64Image: true,
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
        base64Image: true,
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
    });

    return partialMatchUsers;
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

  async getFriends(userId: string) {
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
            base64Image: true,
          },
        },
      },
    });

    const friendsUserInfo = friends.map((f) => {
      const { username, id } = f.destUser;
      return { username, id };
    });

    return friendsUserInfo;
  }

  async getBlockUsers(userId: string) {
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
            base64Image: true,
          },
        },
      },
    });

    const blocksUserInfo = blocks.map((b) => {
      const { username, id } = b.destUser;
      return { username, id };
    });

    return blocksUserInfo;
  }

  async getFriendRequests(userId: string) {
    const requests = await this.prisma.friendship.findMany({
      where: {
        destUserId: userId,
        status: {
          equals: 'Requested',
        },
      },
      include: {
        srcUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return requests.map((r) => r.srcUser);
  }

  async updateUser(userId: string, dto: UserProfileDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    return user;
  }

  async getSentFriendRequests(userId: string) {
    const requests = await this.prisma.friendship.findMany({
      where: {
        srcUserId: userId,
        status: {
          equals: 'Requested',
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

    return requests;
  }

  async getUsersWhoBlockedUser(userId: string) {
    const users = await this.prisma.friendship.findMany({
      where: {
        destUserId: userId,
        status: {
          equals: 'Blocked',
        },
      },
      include: {
        srcUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return users.map((u) => u.srcUser);
  }
}

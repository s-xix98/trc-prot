import { Injectable, ForbiddenException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
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

  async search(searchWord: string) {
    const partialMatchUsers = await this.prisma.user.findMany({
      where: {
        username: {
          contains: searchWord,
          mode: 'insensitive',
        },
      },
    });
    return partialMatchUsers;
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
          },
        },
      },
    });

    return friends;
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
          },
        },
      },
    });

    return blocks;
  }
}

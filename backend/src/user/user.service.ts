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

  async getFriendship(userId:string, targetId:string){
    const outgoingFriendship = await this.prisma.friendship.findUnique({
      where: {
        srcUserId_destUserId: {
          srcUserId: userId,
          destUserId: targetId,
        },
      },
    });

    const incomingFriendship = await this.prisma.friendship.findUnique({
      where: {
        srcUserId_destUserId: {
          srcUserId: targetId,
          destUserId: userId,
        },
      },
    });

    return {outgoingFriendship, incomingFriendship};
  }

  async upsertFriendship(userId:string, targetId:string, status: 'Accepted' | 'Blocked' | 'Requested'){
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
}

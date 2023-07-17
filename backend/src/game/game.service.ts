import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}

  async GetRanking() {
    const ranking = await this.prismaService.rating.findMany({
      select: {
        userData: {
          select: {
            username: true,
          },
        },
        userId: true,
        rating: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });
    return ranking.map((r) => ({
      ...pick(r, 'userId', 'rating'),
      ...r.userData,
    }));
  }

  async UpdateRating(userId: string, result: 'WIN' | 'LOSE') {
    const rankingDiff = result === 'WIN' ? 1 : -1;

    await this.prismaService.rating.upsert({
      where: {
        userId: userId,
      },
      update: {
        rating: { increment: rankingDiff },
      },
      create: {
        userId: userId,
        rating: rankingDiff,
      },
    });
  }

  async UpdateMatchHistory(userId1: string, userId2: string, winnerId?: string) {
    await this.prismaService.matchHistory.create({
      data: {
        player1Id: userId1,
        player2Id: userId2,
        winnerId: winnerId,
      },
    });
  }
}

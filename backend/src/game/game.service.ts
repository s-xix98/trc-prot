import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { MatchHistory } from './dto/Api';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}
  async GetRanking() {
    const ranking = await this.prismaService.rating.findMany({
      select: {
        userData: { select: { id: true, username: true } },
        rating: true,
      },
      orderBy: { rating: 'desc' },
    });

    return ranking;
  }

  async UpdateRating(userId: string, result: 'WIN' | 'LOSE') {
    const rankingDiff = result === 'WIN' ? 1 : -1;
    await this.prismaService.rating.upsert({
      where: { userId: userId },
      update: { rating: { increment: rankingDiff } },
      create: { userId: userId, rating: rankingDiff },
    });
  }

  async GetMatchHistory(userId: string): Promise<MatchHistory[]> {
    const history: MatchHistory[] =
      await this.prismaService.matchHistory.findMany({
        select: {
          player1: { select: { id: true, username: true } },
          player2: { select: { id: true, username: true } },
          winner: { select: { id: true, username: true } },
          createdAt: true,
        },
        where: { OR: [{ player1Id: userId }, { player2Id: userId }] },
        orderBy: { createdAt: 'desc' },
      });

    console.log('history raw', history);
    return history;
  }

  async UpdateMatchHistory(
    userId1: string,
    userId2: string,
    winnerId?: string,
  ) {
    await this.prismaService.matchHistory.create({
      data: { player1Id: userId1, player2Id: userId2, winnerId: winnerId },
    });
  }
}

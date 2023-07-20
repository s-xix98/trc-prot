import { Injectable } from '@nestjs/common';
import { PrsimaClientTx } from 'src/prisma/types';

import { PrismaService } from '../prisma/prisma.service';

import { MatchHistory } from './dto/Api';
import { PlayerResult, ResultEvaluator } from './types';

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

  private async UpdateRating(
    userId: string,
    rankingDiff: number,
    prisma: PrsimaClientTx,
  ) {
    const pricla = prisma || this.prismaService;
    await pricla.rating.upsert({
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

  private async UpdateMatchHistory(
    userId1: string,
    userId2: string,
    winnerId?: string,
    prisma?: PrsimaClientTx,
  ) {
    const pricla = prisma || this.prismaService;
    await pricla.matchHistory.create({
      data: { player1Id: userId1, player2Id: userId2, winnerId: winnerId },
    });
  }

  async saveGameResult(
    p1Result: PlayerResult,
    p2Result: PlayerResult,
    resultEvaluator: ResultEvaluator,
  ) {
    await this.prismaService.$transaction(async (tx) => {
      const players = resultEvaluator(p1Result, p2Result);
      if (players) {
        await Promise.all([
          this.UpdateRating(players.winner.userId, 1, tx),
          this.UpdateRating(players.loser.userId, -1, tx),
          this.UpdateMatchHistory(
            p1Result.userId,
            p2Result.userId,
            players.winner.userId,
            tx,
          ),
        ]);
      } else {
        await this.UpdateMatchHistory(
          p1Result.userId,
          p2Result.userId,
          undefined,
          tx,
        );
      }
    });
  }
}

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

  async getUsers(userIds: string[]) {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
      },
      where: { id: { in: userIds } },
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
            p1Result,
            p2Result,
            players.winner.userId,
            tx,
          ),
        ]);
      } else {
        await this.UpdateMatchHistory(p1Result, p2Result, undefined, tx);
      }
    });
  }

  private async UpdateRating(
    userId: string,
    rankingDiff: number,
    prisma?: PrsimaClientTx,
  ) {
    const pricla = prisma || this.prismaService;
    await pricla.rating.upsert({
      where: { userId: userId },
      update: { rating: { increment: rankingDiff } },
      create: { userId: userId, rating: rankingDiff },
    });
  }

  private async UpdateMatchHistory(
    p1Result: PlayerResult,
    p2Result: PlayerResult,
    winnerId?: string,
    prisma?: PrsimaClientTx,
  ) {
    const pricla = prisma || this.prismaService;
    await pricla.matchHistory.create({
      data: {
        player1Id: p1Result.userId,
        player2Id: p2Result.userId,
        winnerId: winnerId,
        p1Score: p1Result.score,
        p2Score: p2Result.score,
      },
    });
  }
}

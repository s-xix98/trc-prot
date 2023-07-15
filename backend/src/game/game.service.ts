import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRanking() {
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
}

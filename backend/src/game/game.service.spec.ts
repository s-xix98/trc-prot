import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { TestModule } from '../test/test.module';
import { AuthModule } from '../auth/auth.module';
import { TestService } from '../test/test.service';
import { testUser } from '../test/types/test.types';
import { WsocketModule } from '../wsocket/wsocket.module';
import { PrismaModule } from '../prisma/prisma.module';

import { GameService } from './game.service';
import { GameModule } from './game.module';

const USERNUM = 3;

describe('GameService', () => {
  let prisma: PrismaService;
  let game: GameService;
  let testService: TestService;
  let users: testUser[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GameModule,
        PrismaModule,
        TestModule,
        AuthModule,
        WsocketModule,
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    game = module.get<GameService>(GameService);
    testService = module.get<TestService>(TestService);
    users = await testService.createTestUsersWithSockets(USERNUM);
  });

  afterAll(async () => {
    await testService.cleanupDatabase(['rating', 'user']);
  });

  test('basic test', async () => {
    const expectedResult = users
      .map((u, idx) => {
        return {
          userData: {
            id: u.user.id,
            username: u.user.username,
          },
          rating: idx,
        };
      })
      .reverse();

    const tableCreationPromise = users.map(async (u, idx) => {
      await prisma.rating.create({
        data: {
          userId: u.user.id,
          rating: idx,
        },
      });
    });

    await Promise.all(tableCreationPromise);
    const ranking = await game.GetRanking();
    expect(ranking).toEqual(expectedResult);
  });
});

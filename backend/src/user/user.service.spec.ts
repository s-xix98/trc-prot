import { Test, TestingModule } from '@nestjs/testing';
import { testUser } from 'src/test/types/test.types';

import { TestModule } from '../test/test.module';
import { TestService } from '../test/test.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

import { UserService } from './user.service';

const USERNUM = 10;

describe('UserService', () => {
  let userService: UserService;
  let testService: TestService;
  let prismaService: PrismaService;
  let testUsers: testUser[];
  // 初期化
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, AuthModule],
      providers: [UserService, TestService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    testService = module.get<TestService>(TestService);
    prismaService = module.get<PrismaService>(PrismaService);

    testUsers = await testService.createTestUsersWithSockets(USERNUM);
  });

  afterAll(async () => {
    await testService.cleanupDatabase(['user']);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('フレンド', () => {
    test('testUser[0]のフレンドリストの取得', async () => {
      for (let i = 1; i < USERNUM; i++) {
        await prismaService.friendship.create({
          data: {
            srcUserId: testUsers[0].user.id,
            destUserId: testUsers[i].user.id,
            status: 'Accepted',
          },
        });
      }

      const friends = await userService.getFriends(testUsers[0].user.id);

      expect(friends.length).toEqual(USERNUM - 1);
    });
  });

  describe('ブロック', () => {
    test('testUser[0]のブロックリストの取得', async () => {
      for (let i = 1; i < USERNUM; i++) {
        await prismaService.friendship.upsert({
          where: {
            srcUserId_destUserId: {
              srcUserId: testUsers[0].user.id,
              destUserId: testUsers[i].user.id,
            },
          },
          update: {
            status: 'Blocked',
          },
          create: {
            srcUserId: testUsers[0].user.id,
            destUserId: testUsers[i].user.id,
            status: 'Blocked',
          },
        });
      }

      const friends = await userService.getBlockUsers(testUsers[0].user.id);

      expect(friends.length).toEqual(USERNUM - 1);
    });
  });
});

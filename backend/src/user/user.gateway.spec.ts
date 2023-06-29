import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { User } from '@prisma/client';

import { TestService } from '../test/test.service';
import { testUser } from '../test/types/test.types';
import { PrismaService } from '../prisma/prisma.service';
import { TestModule } from '../test/test.module';

import { UserGateway } from './user.gateway';
import { friendshipDto } from './dto/friendship.dto';
import { UserService } from './user.service';

const USERNUM = 10;

const subStrings = (s: string) => {
  const res: string[] = [];
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      res.push(s.substring(i, j));
    }
  }
  return res;
};

describe('UserGateway', () => {
  let gateway: UserGateway;
  let prismaService: PrismaService;
  let testService: TestService;
  let app: INestApplication;
  let userService: UserService;

  let testUsers: testUser[] = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [UserGateway, PrismaService, TestService, UserService],
    }).compile();

    app = module.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.listen(8001);

    gateway = module.get<UserGateway>(UserGateway);
    prismaService = module.get<PrismaService>(PrismaService);
    testService = module.get<TestService>(TestService);
    userService = module.get<UserService>(UserService);

    testUsers = await testService.createTestUsersWithSockets(USERNUM);
  });

  afterAll(async () => {
    testUsers.map((testUser) => {
      testUser.socket.disconnect();
    });

    await app.close();
    await testService.cleanupDatabase(['user']);
  });

  test('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('friendRequest', () => {
    test('1と2がfriend登録されてるか1', async () => {
      const user1 = testUsers[1];
      const user2 = testUsers[2];
      const dto1: friendshipDto = {
        userId: user1.user.id,
        targetId: user2.user.id,
      };
      const dto2: friendshipDto = {
        userId: user2.user.id,
        targetId: user1.user.id,
      };

      user1.socket.emit('friendRequest', dto1);
      user2.socket.emit('friendRequest', dto2);

      await testService.sleep(10000);

      const { srcFriendship, targetFriendship } =
        await userService.getFriendship(user1.user.id, user2.user.id);

      expect(srcFriendship?.srcUserId).toEqual(user1.user.id);
      expect(srcFriendship?.destUserId).toEqual(user2.user.id);
      expect(srcFriendship?.status).toEqual('Accepted');

      expect(targetFriendship?.srcUserId).toEqual(user2.user.id);
      expect(targetFriendship?.destUserId).toEqual(user1.user.id);
      expect(targetFriendship?.status).toEqual('Accepted');
    }, 20000);
  });
});

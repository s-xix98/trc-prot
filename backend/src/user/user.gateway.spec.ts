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

  let testUsers: testUser[] = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [UserGateway, PrismaService, TestService],
    }).compile();

    app = module.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.listen(8001);

    gateway = module.get<UserGateway>(UserGateway);
    prismaService = module.get<PrismaService>(PrismaService);
    testService = module.get<TestService>(TestService);

    testUsers = await testService.createTestUsersWithSockets(USERNUM);

    testUsers.map((testUser) => {
      testUser.socket.on('connect', () => {
        console.log(`connected ${testUser.user.username}`);
      });
    });
  });

  afterAll(async () => {
    testUsers.map((testUser) => {
      testUser.socket.off('connect', () => {
        console.log(`dissconnected ${testUser.user.username}`);
      });
    });

    testUsers.map((testUser) => {
      testUser.socket.disconnect();
    });

    await app.close();
    await testService.cleanupDatabase(['user']);
  });

  test('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('user検索', () => {
    test('user[0]が送った文字列が部分一致するuserを取得', async () => {
      const name = 'aBehS2>あaい';

      await prismaService.user.create({
        data: {
          username: name,
          email: 'test@example.com',
          hashedPassword: 'test',
        },
      });
      const searchWords = subStrings(name);
      let receivedCount = 0;

      const promise = new Promise((resolve) => {
        testUsers[0].socket.on('searchUser', (user: User[]) => {
          const filteredUser = user.filter((u) => u.username === name);
          expect(filteredUser[0].username).toEqual(name);

          receivedCount++;
          if (receivedCount === searchWords.length) {
            resolve(null);
          }
        });
      });

      searchWords.map((searchWord) => {
        testUsers[0].socket.emit('searchUser', { searchWord });
      });

      await promise;
    });
  });

  describe('friendRequest', () => {
    test('friendRequestしたらdbにレコードが存在し正しく挿入されてるか', async () => {
      const dto: friendshipDto = {
        userId: testUsers[0].user.id,
        targetId: testUsers[1].user.id,
      };

      testUsers[0].socket.emit('friendRequest', dto);

      await testService.sleep(3000);

      const friendship = await prismaService.friendship.findUnique({
        where: {
          srcUserId_destUserId: {
            srcUserId: testUsers[0].user.id,
            destUserId: testUsers[1].user.id,
          },
        },
      });

      expect(friendship?.srcUserId).toEqual(testUsers[0].user.id);
      expect(friendship?.destUserId).toEqual(testUsers[1].user.id);
      expect(friendship?.status).toEqual('Requested');
    });
  });

  describe('blockUser', () => {
    test('blockしたらdbに挿入されるか', async () => {
      const dto: friendshipDto = {
        userId: testUsers[0].user.id,
        targetId: testUsers[1].user.id,
      };

      testUsers[0].socket.emit('blockUser', dto);

      await testService.sleep(100);

      const friendship = await prismaService.friendship.findUnique({
        where: {
          srcUserId_destUserId: {
            srcUserId: testUsers[0].user.id,
            destUserId: testUsers[1].user.id,
          },
        },
      });

      expect(friendship?.srcUserId).toEqual(testUsers[0].user.id);
      expect(friendship?.destUserId).toEqual(testUsers[1].user.id);
      expect(friendship?.status).toEqual('Blocked');

      await prismaService.friendship.deleteMany({
        where: {
          srcUserId: testUsers[0].user.id,
          destUserId: testUsers[1].user.id,
        },
      });
    });

    test('blockしたら相手のフレンドリクエストが削除されるか', async () => {
      let dto: friendshipDto = {
        userId: testUsers[1].user.id,
        targetId: testUsers[0].user.id,
      };
      // 1が0にフレンドリクエストを送る
      testUsers[1].socket.emit('friendRequest', dto);
      await testService.sleep(100);

      dto = {
        userId: testUsers[0].user.id,
        targetId: testUsers[1].user.id,
      };
      // 0が1をブロックする
      testUsers[0].socket.emit('blockUser', dto);
      await testService.sleep(100);

      const friendship = await prismaService.friendship.findUnique({
        where: {
          srcUserId_destUserId: {
            srcUserId: testUsers[1].user.id,
            destUserId: testUsers[0].user.id,
          },
        },
      });

      expect(friendship).toBeNull();

      await prismaService.friendship.deleteMany({
        where: {
          srcUserId: testUsers[0].user.id,
          destUserId: testUsers[1].user.id,
        },
      });
    });
  });
});

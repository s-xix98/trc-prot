import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { User } from '@prisma/client';

import { TestService } from '../test/test.service';
import { testUser } from '../test/types/test.types';
import { PrismaService } from '../prisma/prisma.service';
import { TestModule } from '../test/test.module';
import { AuthModule } from '../auth/auth.module';
import { WsocketModule } from '../wsocket/wsocket.module';

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
      imports: [TestModule, AuthModule, WsocketModule],
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

    // test('1と2がfriend登録されてるか', async () => {
    //   const user1 = testUsers[1];
    //   const user2 = testUsers[2];
    //   const dto1: friendshipDto = {
    //     userId: user1.user.id,
    //     targetId: user2.user.id,
    //   };
    //   const dto2: friendshipDto = {
    //     userId: user2.user.id,
    //     targetId: user1.user.id,
    //   };

    //   user1.socket.emit('friendRequest', dto1);
    //   user2.socket.emit('friendRequest', dto2);

    //   await testService.sleep(400);

    //   const { outgoingFriendship, incomingFriendship } =
    //     await userService.getFriendship(user1.user.id, user2.user.id);

    //   expect(outgoingFriendship?.srcUserId).toEqual(user1.user.id);
    //   expect(outgoingFriendship?.destUserId).toEqual(user2.user.id);
    //   expect(outgoingFriendship?.status).toEqual('Accepted');

    //   expect(incomingFriendship?.srcUserId).toEqual(user2.user.id);
    //   expect(incomingFriendship?.destUserId).toEqual(user1.user.id);
    //   expect(incomingFriendship?.status).toEqual('Accepted');
    // });

    test('1と2がfriend登録されてるか', async () => {
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
      await testService.sleep(200);
      user2.socket.emit('friendRequest', dto2);

      await testService.sleep(200);

      const { srcFriendship, targetFriendship } =
        await userService.getFriendship(user1.user.id, user2.user.id);

      expect(srcFriendship?.srcUserId).toEqual(user1.user.id);
      expect(srcFriendship?.destUserId).toEqual(user2.user.id);
      expect(srcFriendship?.status).toEqual('Accepted');

      expect(targetFriendship?.srcUserId).toEqual(user2.user.id);
      expect(targetFriendship?.destUserId).toEqual(user1.user.id);
      expect(targetFriendship?.status).toEqual('Accepted');
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

      testUsers[0].socket.on('deleteFriendRequest', (blockedUserId: string) => {
        expect(blockedUserId).toEqual(testUsers[1].user.id);
      });

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

    test('blockしたらフレンドが削除されるか', async () => {
      const user = testUsers[0];
      const user1 = testUsers[1];

      const dto1: friendshipDto = {
        userId: user.user.id,
        targetId: user1.user.id,
      };
      const dto2: friendshipDto = {
        userId: user1.user.id,
        targetId: user.user.id,
      };

      // フレンド登録
      user.socket.emit('friendRequest', dto1);
      await testService.sleep(100);

      user1.socket.emit('friendRequest', dto2);
      await testService.sleep(100);

      // 0が1をブロックする
      testUsers[0].socket.emit('blockUser', dto1);
      await testService.sleep(100);

      const { srcFriendship, targetFriendship } =
        await userService.getFriendship(dto1.userId, dto1.targetId);

      expect(targetFriendship).toBeNull();
      expect(srcFriendship?.status).toEqual('Blocked');

      await prismaService.friendship.deleteMany({
        where: {
          srcUserId: dto1.userId,
          destUserId: dto1.targetId,
        },
      });
    });
  });

  describe('unfriend unblock', () => {
    test('unfriendしたらdbからレコードが削除されるか', async () => {
      const user4 = testUsers[4];
      const user5 = testUsers[5];
      const dto1: friendshipDto = {
        userId: user4.user.id,
        targetId: user5.user.id,
      };
      const dto2: friendshipDto = {
        userId: user5.user.id,
        targetId: user4.user.id,
      };

      user4.socket.emit('friendRequest', dto1);
      await testService.sleep(200);
      user5.socket.emit('friendRequest', dto2);

      await testService.sleep(200);

      let { srcFriendship, targetFriendship } = await userService.getFriendship(
        user4.user.id,
        user5.user.id,
      );

      expect(srcFriendship?.status).toEqual('Accepted');
      expect(targetFriendship?.status).toEqual('Accepted');

      user4.socket.emit('unfriendUser', dto1);
      await testService.sleep(200);

      ({ srcFriendship, targetFriendship } = await userService.getFriendship(
        user4.user.id,
        user5.user.id,
      ));

      expect(srcFriendship).toBeNull();
      expect(targetFriendship).toBeNull();
    });
  });
});

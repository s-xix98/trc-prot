import { Test, TestingModule } from '@nestjs/testing';
import { ChatRoom } from '@prisma/client';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';

import { TestModule } from '../test/test.module';
import { PrismaService } from '../prisma/prisma.service';
import { testUser } from '../test/types/test.types';
import { TestService } from '../test/test.service';
import { WsocketModule } from '../wsocket/wsocket.module';
import { WsocketGateway } from '../wsocket/wsocket.gateway';

import { CreateChannelDto, JoinChannelDto } from './dto/Channel.dto';
import { ChatGateway } from './chat.gateway';
import { MessageDto } from './dto/message.dto';
import { ChatService } from './chat.service';
import * as bcrypt from 'bcrypt';
const modelNames = ['chatRoom', 'user'];
const USERNUM = 10;

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let prismaService: PrismaService;
  let testUsers: testUser[];
  let room: ChatRoom | null;
  let app: INestApplication;
  let testService: TestService;
  let chatService: ChatService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, WsocketModule],
      providers: [ChatGateway, PrismaService, WsocketGateway, ChatService],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    prismaService = module.get<PrismaService>(PrismaService);
    testService = module.get<TestService>(TestService);
    chatService = module.get<ChatService>(ChatService);

    app = module.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.listen(8001);

    testUsers = [];
    testUsers = await testService.createTestUsersWithSockets(USERNUM);
  });

  afterAll(async () => {
    testUsers.map((testUser) => {
      testUser.socket.disconnect();
    });

    await app.close();

    await testService.cleanupDatabase(modelNames);
  });

  test('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('create Channel', () => {
    test('users[0]が部屋を作成', async () => {
      const user: testUser = testUsers[0];
      const createChannelDto: CreateChannelDto = {
        roomName: 'testroom',
        userId: user.user.id,
      };
      await testService.emitAndWaitForEvent<CreateChannelDto>(
        'createChannel',
        'addRoom',
        user.socket,
        createChannelDto,
      );

      room = await prismaService.chatRoom.findFirst({
        where: {
          roomName: 'testroom',
        },
      });

      expect(room?.roomName).toEqual(createChannelDto.roomName);
    });
  });


  describe('join Channel', () => {
    let roomId: string;
    beforeEach(() => {
      if (!room) {
        throw Error('room is not created');
      }
      roomId = room.id;
    });

    test('users[1]~users[9]が部屋に参加', async () => {
      const promises: Promise<unknown>[] = [];

      testUsers.slice(1).map((testUser) => {
        const joinChannel: JoinChannelDto = {
          userId: testUser.user.id,
          chatRoomId: roomId,
        };
        const joinPromise = testService.emitAndWaitForEvent<JoinChannelDto>(
          'joinChannel',
          'joinChannel',
          testUser.socket,
          joinChannel,
        );
        promises.push(joinPromise);
      });

      await Promise.all(promises).then(async () => {
        const MemberList = await prismaService.roomMember.findMany({
          where: {
            chatRoomId: roomId,
          },
        });
        expect(MemberList.length).toEqual(USERNUM);
      });
    });
  });

  describe('sendMessage', () => {
    let roomId: string;
    beforeEach(() => {
      if (!room) {
        throw Error('room is not created');
      }
      roomId = room.id;
    });

    test('users[0]が送信したメッセージがDBに保存されるか', async () => {
      const user: testUser = testUsers[0];
      const messageDto: MessageDto = {
        content: 'test message',
        userId: user.user.id,
        chatRoomId: roomId,
      };

      await testService.emitAndWaitForEvent<MessageDto>(
        'sendMessage',
        'receiveMessage',
        user.socket,
        messageDto,
      );
      const dbMsg = await prismaService.message.findFirst({
        where: {
          chatRoomId: roomId,
        },
      });

      expect(dbMsg?.content).toEqual(messageDto.content);
    });

    test('users[0]が送信したメッセージが全員に送信されるか', async () => {
      const user = testUsers[0];
      const messageDto: MessageDto = {
        content: 'test message',
        userId: user.user.id,
        chatRoomId: roomId,
      };
      const promises: Promise<unknown>[] = [];

      let receivedCount = 0;

      testUsers.map((user) => {
        const joinPromise = new Promise((resolve) => {
          user.socket.on('receiveMessage', async () => {
            receivedCount++;
            console.log(receivedCount);
            resolve(null);
          });
        });

        promises.push(joinPromise);
      });

      user.socket.emit('sendMessage', messageDto);

      Promise.all(promises).then(() => {
        expect(receivedCount).toEqual(USERNUM);
      });
    });
  });



  describe('パスワード付きの部屋のテスト', () => {
    const roomName = 'passwordRoom';
    const password = 'password';

    test('users[0]がpassword付きの部屋を作れるか', async () => {
      const user: testUser = testUsers[0];
      const createChannelDto: CreateChannelDto = {
        roomName: roomName,
        userId: user.user.id,
        password: password,
      };
      await testService.emitAndWaitForEvent<CreateChannelDto>(
        'createChannel',
        'addRoom',
        user.socket,
        createChannelDto,
      );

      const createdRoom = await prismaService.chatRoom.findFirst({
        where: {
          roomName: roomName,
        },
      });

      if (createdRoom === null || createdRoom.hashedPassword === null) {
        throw Error('createdRoom is null');
      }

      const isMatch = await bcrypt.compare(
        password,
        createdRoom.hashedPassword,
      );

      expect(isMatch).toEqual(true);
    });

    test('password付きの部屋を取得したらHasPasswordがついてるか', async () => {
      const user: testUser = testUsers[0];
      const createChannelDto: CreateChannelDto = {
        roomName: roomName + '1',
        userId: user.user.id,
        password: password,
      };

      await testService.emitAndWaitForEvent<CreateChannelDto>(
        'createChannel',
        'addRoom',
        user.socket,
        createChannelDto,
      );

      const createdRoom = await chatService.search(roomName);
      createdRoom.map((room) => {
        expect(room.hasPassword).toEqual(true);
      });
    });

    test('password付きの部屋に入れるか', async () => {
      const room = await chatService.search(roomName);
      const user = testUsers[1];
      const joinChannel: JoinChannelDto = {
        userId: user.user.id,
        chatRoomId: room[0].id,
        password: password,
      };

      await testService.emitAndWaitForEvent<JoinChannelDto>(
        'joinChannel',
        'joinChannel',
        user.socket,
        joinChannel,
      );

      const MemberList = await prismaService.roomMember.findMany({
        where: {
          chatRoomId: room[0].id,
        },
      });

      expect(MemberList.length).toEqual(2);
    });
  });
});

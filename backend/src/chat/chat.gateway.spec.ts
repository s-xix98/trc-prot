import { Test, TestingModule } from '@nestjs/testing';
import { io, Socket } from 'socket.io-client';
import { ChatRoom, Message, RoomMember, User } from '@prisma/client';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';

import { TestModule } from '../test/test.module';
import { PrismaService } from '../prisma/prisma.service';

import { CreateChannelDto, JoinChannelDto } from './dto/Channel.dto';
import { ChatGateway } from './chat.gateway';
import { MessageDto } from './dto/message.dto';

const USERNUM = 10;
describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let prismaService: PrismaService;
  let clientSocket: Socket[];
  let users: User[];
  let room: ChatRoom | null;
  let app: INestApplication;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [ChatGateway, PrismaService],
    }).compile();
    gateway = module.get<ChatGateway>(ChatGateway);
    prismaService = module.get<PrismaService>(PrismaService);
    app = module.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.listen(8001);
    clientSocket = [];
    users = [];
    for (let i = 0; i < USERNUM; i++) {
      const sock: Socket = io('http://localhost:8001');
      clientSocket.push(sock);
    }
    for (let i = 0; i < USERNUM; i++) {
      const user = await prismaService.user.upsert({
        where: {
          email: `chatTestUser${i}@test.com`,
        },
        update: {},
        create: {
          email: `chatTestUser${i}@test.com`,
          username: `chatTestUser${i}`,
          hashedPassword: `chatTestUser${i}`,
        },
      });
      users.push(user);
    }
    for (let i = 0; i < USERNUM; i++) {
      clientSocket[i].on('connect', () => {
        console.log(`connected ${i}`);
      });
    }
  });
  afterAll(async () => {
    for (let i = 0; i < USERNUM; i++) {
      clientSocket[i].off('connect', () => {
        console.log(`dissconnected ${i}`);
      });
    }
    await app.close();
    for (let i = 0; i < USERNUM; i++) {
      clientSocket[i].disconnect();
    }
    await prismaService.chatRoom.delete({
      where: {
        roomName: room?.roomName || 'testroom',
      },
    });
    for (let i = 0; i < USERNUM; i++) {
      await prismaService.user.delete({
        where: {
          id: users[i].id,
        },
      });
    }
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
  describe('create Channel', () => {
    //users[0]が部屋を作成
    it('should be create Channel successfully', (done) => {
      const createChannelDto: CreateChannelDto = {
        roomName: 'testroom',
        userId: users[0].id,
      };
      clientSocket[0].on('createChannel', async () => {
        room = await prismaService.chatRoom.findFirst({
          where: {
            roomName: 'testroom',
          },
        });
        expect(room?.roomName).toEqual(createChannelDto.roomName);
        done();
      });
      clientSocket[0].emit('createChannel', createChannelDto);
    });
  });

  describe('join Channel', () => {
    let roomId: number;
    beforeEach(() => {
      if (!room) {
        throw Error('room is not created');
      }
      roomId = room.id;
    });
    // users[1]~users[9]が部屋に参加
    it('should be join room successfully', async () => {
      const promise = [];
      let roomMemberList: RoomMember[] = [];
      for (let i = 1; i < USERNUM; i++) {
        const joinChannel: JoinChannelDto = {
          userId: users[i].id,
          chatRoomId: roomId,
        };
        const joinPromise = new Promise((resolve) => {
          clientSocket[i].on('joinChannel', async () => {
            const newRoomMemberList = await prismaService.roomMember.findMany({
              where: {
                chatRoomId: roomId,
              },
            });
            roomMemberList =
              roomMemberList.length < newRoomMemberList.length
                ? newRoomMemberList
                : roomMemberList;
            resolve(null);
          });
          clientSocket[i].emit('joinChannel', joinChannel);
        });
        promise.push(joinPromise);
      }
      await Promise.all(promise);
      expect(roomMemberList.length).toEqual(USERNUM);
    });
  });
  describe('sendMessage', () => {
    let roomId: number;
    beforeEach(() => {
      if (!room) {
        throw Error('room is not created');
      }
      roomId = room.id;
    });
    // users[0]が送信したメッセージがDBに保存されるか
    it('stores user message in db successfully', (done) => {
      const messageDto: MessageDto = {
        content: 'test message',
        userId: users[0].id,
        chatRoomId: roomId,
      };
      clientSocket[0].on('sendMessage', async () => {
        const dbMsg = await prismaService.message.findFirst({
          where: {
            chatRoomId: roomId,
          },
        });
        expect(dbMsg?.content).toEqual(messageDto.content);
        done();
      });
      clientSocket[0].emit('sendMessage', messageDto);
    });
    // users[0]が送信したメッセージが全員に送信されるか
    it('sends user message to all 1 in the room', (done) => {
      const messageDto: MessageDto = {
        content: 'test message',
        userId: users[0].id,
        chatRoomId: roomId,
      };
      let receivedCount = 0;
      for (let i = 0; i < USERNUM; i++) {
        clientSocket[i].on('sendMessage', (emitMsg: Message) => {
          expect(emitMsg.content).toEqual(messageDto.content);
          receivedCount++;
          if (receivedCount === USERNUM) {
            done();
          }
        });
      }
      clientSocket[0].emit('sendMessage', messageDto);
    });
  });
});

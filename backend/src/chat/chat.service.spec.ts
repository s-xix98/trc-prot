import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';
import { PrismaService } from '../prisma/prisma.service';
import { TestService } from '../test/test.service';
import { testUser } from '../test/types/test.types';
import { AuthModule } from '../auth/auth.module';

import { ChatService } from './chat.service';
import {
  CreateChannelDto,
  JoinChannelDto,
  UpdateRoomMemberRoleDto,
} from './dto/Channel.dto';

const USERNUM = 10;

describe('ChatService', () => {
  let chatService: ChatService;
  let testService: TestService;
  let testUser: testUser[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, AuthModule],
      providers: [ChatService, PrismaService, TestService],
    }).compile();

    chatService = module.get<ChatService>(ChatService);
    testService = module.get<TestService>(TestService);

    testUser = await testService.createTestUsersWithSockets(USERNUM);
  });

  afterAll(async () => {
    await testService.cleanupDatabase(['chatRoom', 'user']);
  });

  test('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  describe('roomMember', () => {
    test('roomMemberのroleが更新されるか', async () => {
      const owner = testUser[0];
      const user = testUser[1];

      const createChannelDto: CreateChannelDto = {
        roomName: 'testRoom',
        userId: owner.user.id,
      };

      const room = await chatService.createChannel({
        ...createChannelDto,
      });

      const joinChannelDto: JoinChannelDto = {
        chatRoomId: room.id,
        userId: user.user.id,
      };

      await chatService.JoinChannel(joinChannelDto);

      const updateRoleDto: UpdateRoomMemberRoleDto = {
        role: 'ADMIN',
      };

      const updatedMember = await chatService.updateRoomMemberRole(
        room.id,
        user.user.id,
        owner.user.id,
        updateRoleDto,
      );

      expect(updatedMember.role).toEqual('ADMIN');
    });

    test('roomMemberリストを取得できるか', async () => {
      const [owner, ...roomMembers] = testUser;

      const createChannelDto: CreateChannelDto = {
        roomName: 'roomMemberTest',
        userId: owner.user.id,
      };

      const room = await chatService.createChannel(createChannelDto);

      for (let i = 0; i < roomMembers.length; i++) {
        const joinChannelDto: JoinChannelDto = {
          chatRoomId: room.id,
          userId: roomMembers[i].user.id,
        };

        await chatService.JoinChannel(joinChannelDto);
      }

      const joinedMembers = await chatService.getRoomMembersById(room.id);

      expect(joinedMembers.length).toEqual(10);
    });
  });
});

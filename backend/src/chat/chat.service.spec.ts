import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { TestService } from '../test/test.service';
import { testUser } from '../test/types/test.types';

const USERNUM = 10;

describe('ChatService', () => {
  let chatService: ChatService;
  let testService: TestService;
  let testUser: testUser[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
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
    expect(service).toBeDefined();
  });
});

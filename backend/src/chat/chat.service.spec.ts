import { Test, TestingModule } from '@nestjs/testing';

import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { TestModule } from '../test/test.module';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [ChatService],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

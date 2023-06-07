import { Test, TestingModule } from '@nestjs/testing';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { TestModule } from '../test/test.module';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      controllers: [ChatController],
      providers:[ChatService],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

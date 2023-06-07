import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      controllers: [ChatController],
      providers: [ChatService],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

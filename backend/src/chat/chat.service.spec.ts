import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { ChatService } from './chat.service';

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

import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { PostMessageController } from './post-message.controller';
import { PostMessageService } from './post-message.service';

describe('PostMessageController', () => {
  let controller: PostMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      controllers: [PostMessageController],
      providers: [PostMessageService],
    }).compile();

    controller = module.get<PostMessageController>(PostMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

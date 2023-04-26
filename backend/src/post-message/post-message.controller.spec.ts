import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { PostMessageController } from './post-message.controller';

describe('PostMessageController', () => {
  let controller: PostMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      controllers: [PostMessageController],
    }).compile();

    controller = module.get<PostMessageController>(PostMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { PostMessageController } from './post-message.controller';

describe('PostMessageController', () => {
  let controller: PostMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostMessageController],
    }).compile();

    controller = module.get<PostMessageController>(PostMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

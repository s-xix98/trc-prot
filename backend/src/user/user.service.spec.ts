import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  // 初期化
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [UserService],
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});

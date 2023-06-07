import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

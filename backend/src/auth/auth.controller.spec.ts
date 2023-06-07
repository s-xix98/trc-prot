import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      controllers: [AuthController],
      providers: [AuthService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

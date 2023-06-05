import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { TestModule } from '../test/test.module';

import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, AuthModule],
      controllers: [AuthController],
      providers: [AuthService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

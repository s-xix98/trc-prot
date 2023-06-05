import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { TestModule } from '../test/test.module';

import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, AuthModule],
      providers: [AuthService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

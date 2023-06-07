import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [AuthService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});

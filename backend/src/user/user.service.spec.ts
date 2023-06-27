import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { UserService } from './user.service';
import { TestService } from '../test/test.service';
import { PrismaService } from '../prisma/prisma.service';
import { testUser } from 'src/test/types/test.types';

const USERNUM = 10;

describe('UserService', () => {
  let userService: UserService;
  let testService: TestService;
  let prismaService: PrismaService;
  let testUsers: testUser[];
  // 初期化
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [UserService, TestService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    testService = module.get<TestService>(TestService);
    prismaService = module.get<PrismaService>(PrismaService);

    testUsers = await testService.createTestUsersWithSockets(USERNUM);
  });

  afterAll(async () => {
    await testService.cleanupDatabase(['user']);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});

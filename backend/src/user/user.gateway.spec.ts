import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { UserGateway } from './user.gateway';

describe('UserGateway', () => {
  let gateway: UserGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [UserGateway],
    }).compile();

    gateway = module.get<UserGateway>(UserGateway);
  });

  test('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

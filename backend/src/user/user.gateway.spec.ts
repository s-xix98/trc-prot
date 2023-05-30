import { Test, TestingModule } from '@nestjs/testing';
import { UserGateway } from './user.gateway';
import { TestModule } from '../test/test.module';

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

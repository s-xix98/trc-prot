import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { WsocketModule } from '../wsocket/wsocket.module';
import { UserModule } from '../user/user.module';

import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

describe('GameGateway', () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WsocketModule, UserModule],
      providers: [GameGateway, GameService, PrismaService, ConfigService],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

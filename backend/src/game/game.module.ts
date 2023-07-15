import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [PrismaModule],
  providers: [GameGateway, GameService],
  controllers: [GameController],
})
export class GameModule {}

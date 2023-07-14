import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [PrismaModule],
  providers: [GameGateway, GameService],
})
export class GameModule {}

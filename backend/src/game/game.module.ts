import { Module, forwardRef } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { WsocketModule } from '../wsocket/wsocket.module';

import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  imports: [PrismaModule, WsocketModule, forwardRef(() => UserModule)],
  providers: [GameGateway, GameService],
  controllers: [GameController],
  exports: [GameGateway],
})
export class GameModule {}

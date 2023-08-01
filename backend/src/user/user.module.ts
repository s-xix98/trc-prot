import { Module, forwardRef } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { WsocketModule } from '../wsocket/wsocket.module';
import { ChatModule } from '../chat/chat.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { GameModule } from '../game/game.module';

@Module({
  imports: [PrismaModule, WsocketModule, GameModule , forwardRef(() => ChatModule)],
  controllers: [UserController],
  providers: [UserService, UserGateway],
  exports: [UserService],
})
export class UserModule {}

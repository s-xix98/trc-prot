import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { WsocketModule } from '../wsocket/wsocket.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [PrismaModule, WsocketModule, ChatModule],
  controllers: [UserController],
  providers: [UserService, UserGateway],
})
export class UserModule {}

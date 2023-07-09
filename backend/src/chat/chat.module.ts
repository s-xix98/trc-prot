import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { WsocketModule } from '../wsocket/wsocket.module';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, WsocketModule, UserModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}

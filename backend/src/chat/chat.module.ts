import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { WsocketModule } from '../wsocket/wsocket.module';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';

@Module({
  imports: [PrismaModule, WsocketModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatGateway],
})
export class ChatModule {}

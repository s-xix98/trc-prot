import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { WsocketModule } from '../wsocket/wsocket.module';

@Module({
  imports: [PrismaModule, WsocketModule],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}

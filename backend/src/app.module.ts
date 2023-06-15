import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { PostMessageModule } from './post-message/post-message.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { WsocketModule } from './wsocket/wsocket.module';

@Module({
  imports: [
    PrismaModule,
    PostMessageModule,
    ConfigModule,
    UserModule,
    ChatModule,
    AuthModule,
    WsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}

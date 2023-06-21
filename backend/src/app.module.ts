import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { WsocketModule } from './wsocket/wsocket.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    UserModule,
    ChatModule,
    AuthModule,
    WsocketModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

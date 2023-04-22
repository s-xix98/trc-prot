import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { PostMessageModule } from './post-message/post-message.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, PostMessageModule, ConfigModule, UserModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}

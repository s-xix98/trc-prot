import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { WsocketModule } from '../wsocket/wsocket.module';

@Module({
  imports: [PrismaModule, WsocketModule],
  controllers: [UserController],
  providers: [UserService, UserGateway],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserGateway],
})
export class UserModule {}

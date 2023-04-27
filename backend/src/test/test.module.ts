import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [PrismaService, ConfigService],
  exports: [PrismaService, ConfigService],
})
export class TestModule {}

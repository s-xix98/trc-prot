import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

import { TestService } from './test.service';

@Module({
  imports: [PrismaModule, ConfigModule, AuthModule],
  providers: [PrismaService, ConfigService, TestService],
  exports: [PrismaService, ConfigService],
})
export class TestModule {}

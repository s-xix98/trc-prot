import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || '',
      }),
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

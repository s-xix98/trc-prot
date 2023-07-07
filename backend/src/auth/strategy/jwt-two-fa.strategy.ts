import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { jwtPayload } from '../types/auth.types';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtTwoFaStrategy extends PassportStrategy(Strategy, 'jwt-two-fa') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'hoge',
    });
  }

  async validate(payload: jwtPayload) {
    console.log(payload);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // twofa disableの場合
    if (!user.isTwoFaEnabled) {
      return payload;
    }

    // twofa enableで totpやってない場合
    if (!payload.isTwoFactorAuthenticated) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}

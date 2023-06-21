import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { authUser } from '../types/auth.types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      // 値がない場合undefinedにり、buildできないのでhoge入れとく
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'hoge',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'hoge',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'hoge',
      scope: ['email', 'profile', 'openid'],
      accessType: 'offline',
    });
  }

  async validate(
    // 使わん
    // eslint-disable-next-line
    accessToken: string,
    // 使わん
    // eslint-disable-next-line
    refreshToken: string,
    profile: Profile,
  ): Promise<authUser> {
    const { id, emails } = profile;
    console.log('id', id);
    console.log('emails', emails);

    // emailは100%あるはずだが、undefinedの可能性があるので
    if (!emails) {
      throw new UnauthorizedException('no email');
    }

    const user: authUser = {
      id,
      email: emails[0].value,
      provider: 'google',
    };

    return user;
  }
}

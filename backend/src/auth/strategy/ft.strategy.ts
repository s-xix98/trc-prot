import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { ConfigService } from '@nestjs/config';

import { authUser } from '../types/auth.types';
@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('FORTY_TWO_CLIENT_ID') || 'hoge',
      clientSecret:
        configService.get<string>('FORTY_TWO_CLIENT_SECRET') || 'hoge',
      callbackURL:
        configService.get<string>('FORTY_TWO_CALLBACK_URL') || 'hoge',
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<authUser> {
    // console.log('profile', profile.id);
    // console.log('profile', profile.emails[0].value);
    // console.log('profile', profile.provider);

    const user: authUser = {
      id: profile.id,
      email: profile.emails[0].value,
      provider: profile.provider,
    };

    return user;
  }
}

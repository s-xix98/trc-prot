import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { accessToken } from './types/auth.types';

import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) {}

  async providerLogin(): Promise<accessToken> {
    const mockUserData = {
      id: 'mockId',
      username: 'mockUsername',
    };

    const jwt = await this.generateJwt(mockUserData.id, mockUserData.username);
    return { jwt };
  }

  async generateJwt(userId: string, username: string): Promise<string> {
    const payload = {
      userId,
      username,
    };

    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }
}

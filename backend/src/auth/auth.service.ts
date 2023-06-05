import { Injectable } from '@nestjs/common';
import { accessToken } from './types/auth.types';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async ftLogin(): Promise<accessToken> {
    const mockUserData = {
      id: 'mockId',
      username: 'mockUsername',
    };

    return { jwt: await this.generateJwt(mockUserData.id, mockUserData.username)};
  }

  async generateJwt(id: string, username: string): Promise<string> {
    const payload = {
      id,
      username,
    };
    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }
}

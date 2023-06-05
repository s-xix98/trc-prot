import { Injectable } from '@nestjs/common';
import { accessToken } from './types/auth.types';
@Injectable()
export class AuthService {
  ftLogin(): accessToken {
    const mockJwt = 'mockJwt';
    return { jwt: mockJwt };
  }
}

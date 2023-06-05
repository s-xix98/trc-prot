import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  ftLogin() {
    const mockJwt = 'mockJwt';
    return mockJwt;
  }
}

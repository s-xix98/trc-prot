import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

  providerLogin() {
    const mockJwt = 'mockJwt';
    return mockJwt;
  }
}

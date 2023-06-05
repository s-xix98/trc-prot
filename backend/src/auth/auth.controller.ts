import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { accessToken } from './types/auth.types';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService :AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('42login')
  async ftLogin():Promise<accessToken> {
    return this.authService.ftLogin();
  }
}
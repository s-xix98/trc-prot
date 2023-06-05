import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService :AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('42login')
  async ftLogin() {
    return this.authService.ftLogin();
  }
}
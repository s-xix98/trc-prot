import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { accessToken } from './types/auth.types';
import { authLoginDto } from './dto/auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService :AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('42login')
  async ftLogin(@Body() dto: authLoginDto):Promise<accessToken> {
    return this.authService.ftLogin(dto);
  }
}
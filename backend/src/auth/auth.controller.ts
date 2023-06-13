import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { accessToken } from './types/auth.types';
import { signUpDto } from './dto/signUp.dto';
// TODO front直したら消す
type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  nickname: string;
  hashedPassword: string;
};
@Controller('auth')
@ApiTags('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('providerLogin')
  @ApiOperation({ summary: 'providerLogin' })
  async providerLogin(): Promise<accessToken> {
    return this.authService.providerLogin();
  }

  @Post('signup')
  @ApiOperation({ summary: 'signUp nori' })
  async signUp(@Body() dto: signUpDto): Promise<User> {
    const userData = await this.authService.signUp(dto);
    return {
      id: userData.id,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      email: userData.email,
      nickname: userData.username,
      hashedPassword: userData.hashedPassword,
    };
  }
}

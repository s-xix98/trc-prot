import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { accessToken } from './types/auth.types';
import { signUpDto } from './dto/signUp.dto';
import { loginDto } from './dto/login.dto';
import { User } from '@prisma/client';

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
    return this.authService.signUp(dto);

  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'login nori' })
  async login(@Body() dto: loginDto): Promise<User> {
    return this.authService.login(dto);
  }
}

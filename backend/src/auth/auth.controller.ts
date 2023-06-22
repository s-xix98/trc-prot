import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Redirect,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { accessToken } from './types/auth.types';
import { signUpDto } from './dto/signUp.dto';
import { loginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { FtAuthGuard } from './guard/ft-auth.guard';

import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService:ConfigService) {}

  @Post('signup')
  @ApiOperation({ summary: 'signUp nori' })
  async signUp(@Body() dto: signUpDto): Promise<accessToken> {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'login nori' })
  async login(@Body() dto: loginDto): Promise<accessToken> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jwtTest')
  jwtTest(@Request() req: any) {
    return req.user;
  }

  @Get('jwtHuga')
  async jwtHuga(): Promise<accessToken> {
    return this.authService.jwtHuga();
  }

  // googleAuthのエンドポイント
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line
  async googleAuth() {}

  // googleAuthの処理が終わった後のエンドポイント
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  async GoogleRedirect(@Request() req: any) {
    const frontUrl = this.configService.get<string>('FRONTEND') || 'http://localhost:3000';
    const token = await this.authService.providerLogin(req.user);
    return {url: frontUrl + '/login?access_token=' + token.jwt};
  }

  @Get('42')
  @UseGuards(FtAuthGuard)
  // eslint-disable-next-line
  async ftAuth() {}

  @Get('42/redirect')
  @UseGuards(FtAuthGuard)
  @Redirect()
  async ftRedirect(@Request() req: any) {
    const frontUrl = this.configService.get<string>('FRONTEND') || 'http://localhost:3000';
    const token = await this.authService.providerLogin(req.user);
    return {url: frontUrl + '/login?access_token=' + token.jwt};
  }
}

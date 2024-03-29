import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  ForbiddenException,
  Redirect,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { PrismaService } from '../prisma/prisma.service';

import { AuthService } from './auth.service';
import { accessToken } from './types/auth.types';
import { signUpDto } from './dto/signUp.dto';
import { loginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { FtAuthGuard } from './guard/ft-auth.guard';
import { QRCode } from './types/qrcode.types';
import { TwoFaDto } from './dto/twoFa.dto';
import { JwtTwoFaAuthGuard } from './guard/jwt-two-fa.guard';

@Controller('auth')
@ApiTags('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

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
  async GoogleRedirect(@Request() req: any, @Res() res: Response) {
    const frontUrl =
      this.configService.get<string>('FRONTEND') || 'http://localhost:3000';
    const token = await this.authService.providerLogin(req.user);
    res.redirect(frontUrl + '/login?access_token=' + token.jwt);
  }

  @Get('42')
  @UseGuards(FtAuthGuard)
  // eslint-disable-next-line
  async ftAuth() {}

  @Get('42/redirect')
  @UseGuards(FtAuthGuard)
  @Redirect()
  async ftRedirect(@Request() req: any, @Res() res: Response) {
    const frontUrl =
      this.configService.get<string>('FRONTEND') || 'http://localhost:3000';
    const token = await this.authService.providerLogin(req.user);
    res.redirect(frontUrl + '/login?access_token=' + token.jwt);
  }

  @Get('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async generateTwoFa(@Request() req: any): Promise<QRCode> {
    console.log('2fa/generate', req.user);
    return this.authService.generateTwoFaSecret({
      username: req.user.username,
      id: req.user.userId,
    });
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enableTwoFa(@Request() req: any, @Body() dto: TwoFaDto): Promise<void> {
    console.log('2fa/enable', req.user, dto);

    const isValid = await this.authService.isTwoFaCodeValidForUser(
      dto.twoFaCode,
      req.user.userId,
    );

    if (!isValid) {
      throw new ForbiddenException();
    }

    await this.authService.enableTwoFa(req.user.userId);
  }

  @Post('2fa/authentication')
  @UseGuards(JwtAuthGuard)
  async authentication(
    @Request() req: any,
    @Body() dto: TwoFaDto,
  ): Promise<accessToken> {
    console.log('2fa/authentication', req.user, dto);
    const isValid = await this.authService.isTwoFaCodeValidForUser(
      dto.twoFaCode,
      req.user.userId,
    );

    const user = await this.prismaService.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!isValid || !user || !user.isTwoFaEnabled) {
      throw new ForbiddenException();
    }

    const token = await this.authService.generateJwt(
      req.user.userId,
      req.user.username,
      user.isTwoFaEnabled,
      true,
    );

    return { jwt: token };
  }

  @Get('2fa/check')
  @UseGuards(JwtTwoFaAuthGuard)
  async checkTwoFa(@Request() req: any) {
    console.log('2fa/check ok', req.user);
  }
}

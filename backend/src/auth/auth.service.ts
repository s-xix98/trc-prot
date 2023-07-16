import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

import { PrismaService } from '../prisma/prisma.service';
import { UserInfo } from '../game/dto/UserDto';

import { accessToken, authUser, jwtPayload } from './types/auth.types';
import { signUpDto } from './dto/signUp.dto';
import { loginDto } from './dto/login.dto';
import { QRCode } from './types/qrcode.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  decodeJwt(token: string) {
    return this.jwtService.decode(token);
  }

  async verifyJwt(token: any) {
    return this.jwtService.verifyAsync(token);
  }

  async providerLogin(auser: authUser): Promise<accessToken> {
    const user = await this.prismaService.auth.findUnique({
      include: {
        user: true,
      },
      where: {
        providerName_providerId: {
          providerName: auser.provider,
          providerId: auser.id,
        },
      },
    });
    // 既に登録されている場合
    if (user) {
      return {
        jwt: await this.generateJwt(
          user.user.id,
          user.user.username,
          user.user.isTwoFaEnabled,
        ),
      };
    }

    // まだ登録されていない場合
    const newUser = await this.prismaService.user.create({
      data: {
        email: auser.email,

        auth: {
          create: {
            providerName: auser.provider,
            providerId: auser.id,
          },
        },
      },
    });

    return {
      jwt: await this.generateJwt(
        newUser.id,
        newUser.username,
        newUser.isTwoFaEnabled,
      ),
    };
  }

  async generateJwt(
    userId: string,
    username: string,
    isTwoFaEnabled: boolean,
    isTwoFactorAuthenticated = false,
  ): Promise<string> {
    const payload: jwtPayload = {
      userId,
      username,
      isTwoFaEnabled,
      isTwoFactorAuthenticated,
    };

    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }

  async signUp(dto: signUpDto): Promise<accessToken> {
    console.log(dto);

    const hashedPassword = await bcrypt.hash(dto.hashedPassword, 10);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hashedPassword: hashedPassword,
        },
      });
      return {
        jwt: await this.generateJwt(user.id, user.username, user.isTwoFaEnabled),
      };
    } catch (e) {
      console.log(e);
      // email,usernameが被った時のエラーは'P2002'が帰ってくる
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Email or username is already taken');
        }
      }
      // 500 internal server err
      throw e;
    }
  }
  // TODO authのエラーを追加する
  async login(dto: loginDto): Promise<accessToken> {
    console.log(dto);
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      console.log('emailが間違っている');
      throw new ForbiddenException('Email incorrect');
    }

    if (user.hashedPassword === null) {
      throw new Error('logic error');
    }

    const isMatch = await bcrypt.compare(
      dto.hashedPassword,
      user.hashedPassword,
    );

    if (!isMatch) {
      console.log(user.hashedPassword, dto.hashedPassword);
      console.log('passwordが間違っている');
      throw new ForbiddenException('Password incorrect');
    }
    console.log('OK');
    return {
      jwt: await this.generateJwt(user.id, user.username, user.isTwoFaEnabled),
    };
  }

  async jwtHuga(): Promise<accessToken> {
    const huga = await this.prismaService.user.findUnique({
      where: {
        username: 'huga',
      },
    });
    if (!huga) {
      throw new Error('huga not found');
    }
    return {
      jwt: await this.generateJwt(huga.id, huga.username, huga.isTwoFaEnabled),
    };
  }

  async generateTwoFaSecret(user: UserInfo): Promise<QRCode> {
    const serviceName = 'trc';
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.username, serviceName, secret);

    await this.setTwoFaSecret(user.id, secret);
    const qrCode = await toDataURL(otpAuthUrl);

    console.log(otpAuthUrl);
    console.log('secret:', secret);
    console.log(qrCode);

    return { base64: qrCode };
  }

  async enableTwoFa(userId: string): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        isTwoFaEnabled: true,
      },
    });
  }

  async isTwoFaCodeValidForUser(
    twoFaCode: string,
    userId: string,
  ): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (
      !user ||
      !user.twoFaSecret ||
      !this.isValidTwoFaCode(user.twoFaSecret, twoFaCode)
    ) {
      return false;
    }

    return true;
  }

  private isValidTwoFaCode(sharedSecret: string, inputCode: string) {
    return authenticator.verify({
      token: inputCode,
      secret: sharedSecret,
    });
  }

  private async setTwoFaSecret(userId: string, secret: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFaSecret: secret,
      },
    });
  }
}

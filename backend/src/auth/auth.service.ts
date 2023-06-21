import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { accessToken } from './types/auth.types';
import { signUpDto } from './dto/signUp.dto';
import { loginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async providerLogin(): Promise<accessToken> {
    const mockUserData = {
      id: 'mockId',
      username: 'mockUsername',
    };

    const jwt = await this.generateJwt(mockUserData.id, mockUserData.username);
    return { jwt };
  }

  async generateJwt(userId: string, username: string): Promise<string> {
    const payload = {
      userId,
      username,
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
      return { jwt: await this.generateJwt(user.id, user.username) };
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
    return { jwt: await this.generateJwt(user.id, user.username) };
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
    return { jwt: await this.generateJwt(huga.id, huga.username) };
  }
}

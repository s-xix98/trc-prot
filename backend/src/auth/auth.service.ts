import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { accessToken } from './types/auth.types';

import { PrismaService } from '../prisma/prisma.service';
import { signUpDto } from './dto/signUp.dto';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { loginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) {}

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

  async signUp(dto: signUpDto): Promise<User> {
    console.log(dto);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          username: dto.nickname,
          // 今後ハッシュ化
          hashedPassword: dto.hashedPassword,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
      // email,nicknameが被った時のエラーは'P2002'が帰ってくる
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Email or nickname is already taken');
        }
      }
      // 500 internal server err
      throw e;
    }
  }

  async login(dto: loginDto): Promise<User> {
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
    if (user.hashedPassword != dto.hashedPassword) {
      console.log(user.hashedPassword, dto.hashedPassword);
      console.log('passwordが間違っている');
      throw new ForbiddenException('Password incorrect');
    }
    console.log('OK');
    return user;
  }
}

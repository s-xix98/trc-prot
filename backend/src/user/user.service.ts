import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { loginDto, signUpDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto: signUpDto): Promise<User> {
    console.log(dto);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          nickname: dto.nickname,
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
    const user = await this.prisma.user.findUnique({
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

import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { loginDto, signUpDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto: signUpDto) {
    // エラー処理は書いてない
    console.log(dto);
    const user = this.prisma.user.create({
      data: {
        email: dto.email,
        nickname: dto.nickname,
        // 今後ハッシュ化
        hashedPassword: dto.hashedPassword,
      },
    });
    user
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        // emailが被った時のエラーは'P2002'が帰ってくる
        console.log(e);
      });
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
    } else if (user.hashedPassword != dto.hashedPassword) {
      console.log('passwordが間違っている');
      throw new ForbiddenException('Password incorrect');
    } else {
      console.log('OK');
    }
    return user;
  }
}

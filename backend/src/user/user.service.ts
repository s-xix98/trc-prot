import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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
        // 失敗時には'P2002'が帰ってくる
        console.log(e);
      });
  }
  async login(dto: loginDto) {}
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';

import { accessToken } from './types/auth.types';
import { authLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async ftLogin(dto: authLoginDto): Promise<accessToken> {
    const authUser = await this.prismaService.auth.findUnique({
      include: { user: true },
      where: {
        providerName_providerId: {
          providerId: dto.providerId,
          providerName: dto.providerName,
        },
      },
    });

    if (authUser) {
      return {
        jwt: await this.generateJwt(authUser.userId, authUser.user.username),
      };
    }

    const createdUser = await this.prismaService.user.create({
      include: { auth: true },
      data: {
        email: dto.email,
        // TODO hashedPassword? にしたら消す
        hashedPassword: 'mockHashedPassword',
        auth: {
          create: {
            providerId: dto.providerId,
            providerName: dto.providerName,
          },
        },
      },
    });
    return {
      jwt: await this.generateJwt(createdUser.id, createdUser.username),
    };
  }

  async generateJwt(id: string, username: string): Promise<string> {
    const payload = {
      id,
      username,
    };
    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }
}

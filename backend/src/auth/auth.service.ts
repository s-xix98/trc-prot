import { Injectable } from '@nestjs/common';
import { accessToken } from './types/auth.types';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly prismaService:PrismaService) {}

  async ftLogin(): Promise<accessToken> {

    const mockAuthLoginDto = {
      email: 'mockEmail@example.com',
      mockHashedPassword: 'mockHashedPassword',
      providerId: 'mockSub',
      providerName: '42',
    };

    const authUser = await this.prismaService.auth.findUnique({
      include: { user: true },
      where: {
        providerName_providerId: {
          providerId: mockAuthLoginDto.providerId,
          providerName: mockAuthLoginDto.providerName,
        },
      },
    });

    if (authUser) {
      return { jwt: await this.generateJwt(authUser.userId, authUser.user.username)};
    }

    const createdUser = await this.prismaService.user.create({
      include: { auth: true },
      data: {
        email: mockAuthLoginDto.email,
        // TODO hashedPassword? にしたら消す
        hashedPassword: mockAuthLoginDto.mockHashedPassword,
        auth: {
          create: {
            providerId: mockAuthLoginDto.providerId,
            providerName: mockAuthLoginDto.providerName,
          },
        },
      },
    });
    return { jwt: await this.generateJwt(createdUser.id, createdUser.username)};
  }

  async generateJwt(id: string, username: string): Promise<string> {
    const payload = {
      id,
      username,
    };
    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }
}

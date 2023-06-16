import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';

import { TestModule } from '../test/test.module';
import { PrismaService } from '../prisma/prisma.service';

import { AuthService } from './auth.service';
import { signUpDto } from './dto/signUp.dto';

const dto: signUpDto = {
  email: 'signUp@example.com',
  username: 'signUp',
  hashedPassword: 'signupsignup',
};

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [AuthService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  afterAll(async () => {
    await prismaService.user.delete({
      where: {
        email: 'signUp@example.com',
      },
    });
    await prismaService.$disconnect();
  });
  test('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('signUp', () => {
    test('should be create user successfully', async () => {
      // await prismaService.user.delete({where: {email: 'signUp@example.com'}});
      const user = await authService.signUp(dto);
      expect(user.email).toEqual(dto.email);
      expect(user.username).toEqual(dto.username);
      expect(user.hashedPassword).toEqual(dto.hashedPassword);
    });

    test('should be throw ForbiddenException when email or username is already taken', async () => {
      await expect(authService.signUp(dto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('login', () => {
    test('should be login successfully', async () => {
      const user = await authService.login({
        email: dto.email,
        hashedPassword: dto.hashedPassword,
      });
      expect(user.email).toEqual(dto.email);
      expect(user.username).toEqual(dto.username);
      expect(user.hashedPassword).toEqual(dto.hashedPassword);
    });

    test('should be throw ForbiddenException when email is incorrect', async () => {
      await expect(
        authService.login({
          email: 'fail@email.com',
          hashedPassword: dto.hashedPassword,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    test('should be throw ForbiddenException when password is incorrect', async () => {
      await expect(
        authService.login({
          email: dto.email,
          hashedPassword: 'failPassword',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';

import { TestModule } from '../test/test.module';
import { PrismaService } from '../prisma/prisma.service';

import { UserService } from './user.service';
import { signUpDto } from './dto/user.dto';
const dto: signUpDto = {
  email: 'signUp@example.com',
  nickname: 'signUp',
  hashedPassword: 'signupsignup',
};
describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  // 初期化
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [UserService],
    }).compile();
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // 全部のテストが終わった後に実行される
  afterAll(async () => {
    await prismaService.user.delete({
      where: {
        email: 'signUp@example.com',
      },
    });
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('signUp', () => {
    it('should be create user successfully', async () => {
      // await prismaService.user.delete({where: {email: 'signUp@example.com'}});
      const user = await userService.signUp(dto);
      expect(user.email).toEqual(dto.email);
      expect(user.username).toEqual(dto.nickname);
      expect(user.hashedPassword).toEqual(dto.hashedPassword);
    });

    it('should be throw ForbiddenException when email or nickname is already taken', async () => {
      await expect(userService.signUp(dto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('login', () => {
    it('should be login successfully', async () => {
      const user = await userService.login({
        email: dto.email,
        hashedPassword: dto.hashedPassword,
      });
      expect(user.email).toEqual(dto.email);
      expect(user.username).toEqual(dto.nickname);
      expect(user.hashedPassword).toEqual(dto.hashedPassword);
    });

    it('should be throw ForbiddenException when email is incorrect', async () => {
      await expect(
        userService.login({
          email: 'fail@email.com',
          hashedPassword: dto.hashedPassword,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should be throw ForbiddenException when password is incorrect', async () => {
      await expect(
        userService.login({
          email: dto.email,
          hashedPassword: 'failPassword',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});

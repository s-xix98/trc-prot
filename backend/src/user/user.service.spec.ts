import { Test, TestingModule } from '@nestjs/testing';

import { TestModule } from '../test/test.module';

import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { signUpDto } from './dto/user.dto';
import { ForbiddenException } from '@nestjs/common';
const dto: signUpDto = {
  email: 'signUp@example.com',
  nickname: 'signUp',
  hashedPassword: 'signupsignup',
};
describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  // it前に実行される
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
      providers: [UserService],
    }).compile();
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // it後に実行される
  // disconnect()しないとエラーが出る
  // A worker process has failed to exit gracefully and has been force exited.
  // This is likely caused by tests leaking due to improper teardown.
  // Try running with --detectOpenHandles to find leaks. Active timers can also cause this,
  // ensure that .unref() was called on them.
  afterEach(async () => {
    prismaService.$disconnect();
  });
  // 全部のテストが終わった後に実行される
  afterAll(async () => {
    await prismaService.user.delete({
      where: {
        email: 'signUp@example.com',
      },
    });
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('signUp',() => {

    it('should be create user successfully', async () => {
      // await prismaService.user.delete({where: {email: 'signUp@example.com'}});
      const user = await userService.signUp(dto);
      expect(user.email).toEqual(dto.email);
      expect(user.nickname).toEqual(dto.nickname);
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
      expect(user.nickname).toEqual(dto.nickname);
      expect(user.hashedPassword).toEqual(dto.hashedPassword);
    });

    it('should be throw ForbiddenException when email is incorrect', async () => {
      await expect(userService.login({
        email:'fail@email.com',
        hashedPassword: dto.hashedPassword
      })).rejects.toThrow(ForbiddenException);
    });

    it('should be throw ForbiddenException when password is incorrect', async () => {
      await expect(userService.login({
        email: dto.email,
        hashedPassword: 'failPassword'
      })).rejects.toThrow(ForbiddenException);
    });
  });
});

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { loginDto, signUpDto } from './dto/user.dto';
import { UserService } from './user.service';
// TODO front直したら消す
type User = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  nickname: string;
  hashedPassword: string;
};
@Controller('user')
@ApiTags('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'signUp nori' })
  async signUp(@Body() dto: signUpDto): Promise<User> {
    console.log('on /user/signup');
    const userData = await this.userService.signUp(dto);
    return {
      id: userData.id,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      email: userData.email,
      nickname: userData.username,
      hashedPassword: userData.hashedPassword,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'login nori' })
  async login(@Body() dto: loginDto): Promise<User> {
    console.log('on /user/login');
    const userData = await this.userService.login(dto);
    return {
      id: userData.id,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      email: userData.email,
      nickname: userData.username,
      hashedPassword: userData.hashedPassword,
    };
  }
}

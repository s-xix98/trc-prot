import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { loginDto, signUpDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'signUp nori' })
  async signUp(@Body() dto: signUpDto): Promise<User> {
    console.log('on /user/signup');
    return this.userService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'login nori' })
  async login(@Body() dto: loginDto): Promise<User> {
    console.log('on /user/login');
    return this.userService.login(dto);
  }
}

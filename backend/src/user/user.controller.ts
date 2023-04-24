import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { loginDto, signUpDto } from './dto/user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() dto: signUpDto) {
    this.userService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: loginDto): Promise<User> {
    return this.userService.login(dto);
  }
}

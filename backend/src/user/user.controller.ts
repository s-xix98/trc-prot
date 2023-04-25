import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { loginDto, signUpDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'signUp nori' })
  signUp(@Body() dto: signUpDto) {
    this.userService.signUp(dto);
  }
  @Post('login')
  @ApiOperation({ summary: 'login nori' })
  login(@Body() dto: loginDto) {
    this.userService.login(dto);
  }
}

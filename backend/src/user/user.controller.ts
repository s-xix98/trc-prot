import { Body, Controller, Post } from '@nestjs/common';
import { loginDto, signUpDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() dto: signUpDto) {
    this.userService.signUp(dto);
  }
  @Post('login')
  login(@Body() dto: loginDto) {
    this.userService.login(dto);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { signUpDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signUp(@Body() dto: signUpDto) {
    this.userService.signUp(dto);
  }
}

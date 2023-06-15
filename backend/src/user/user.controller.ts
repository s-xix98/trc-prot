import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { UserService } from './user.service';

@Controller('user')
@ApiTags('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }
}

import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.gurad';

@Controller('user')
@ApiTags('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Request() req: any) {
    return req.user;
  }

  @ApiOperation({ summary: 'findOne' })
  @ApiParam({
    name: 'username',
    required: true,
    type: String,
    description: 'username',
  })
  @Get(':username')
  async findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }
}

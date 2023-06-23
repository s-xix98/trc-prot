import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
@ApiTags('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async findMe(@Request() req: any) {
    return this.userService.findOneById(req.user.userId);
  }

  @ApiOperation({ summary: 'findOne' })
  @ApiParam({
    name: 'username',
    required: true,
    type: String,
    description: 'username',
  })
  @Get('profile/:username')
  async findOne(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }

  @Get('search/:searchWord')
  async search(@Param('searchWord') searchWord: string) {
    return this.userService.search(searchWord);
  }
}

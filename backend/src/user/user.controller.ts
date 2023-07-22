import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

import { JwtTwoFaAuthGuard } from '../auth/guard/jwt-two-fa.guard';

import { UserService } from './user.service';

@UseGuards(JwtTwoFaAuthGuard)
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

  @Get('search')
  async search(@Query('searchWord') searchWord: string, @Request() req: any) {
    console.log(searchWord);
    return this.userService.search(searchWord, req.user.userId);
  }
}

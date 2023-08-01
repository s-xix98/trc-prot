import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ChatRoom } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtTwoFaAuthGuard } from '../auth/guard/jwt-two-fa.guard';
import { UserInfo } from '../user/types/userInfo';

import { ChatService } from './chat.service';

@UseGuards(JwtTwoFaAuthGuard)
@Controller('chat')
@ApiTags('/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'getChannels' })
  async getAllChannels(): Promise<ChatRoom[]> {
    return this.chatService.getAllChannels();
  }

  @Get('rooms/:id/history')
  async getChannelHistoryById(@Param('id') roomId: string) {
    return this.chatService.getChannelHistoryById(roomId);
  }

  @Get('rooms/:id/members')
  async getRoomMembersById(@Param('id') roomId: string): Promise<UserInfo[]> {
    return this.chatService.getRoomMembersById(roomId);
  }

  @Get('search')
  async search(@Query('searchWord') searchWord: string) {
    return this.chatService.search(searchWord);
  }
}

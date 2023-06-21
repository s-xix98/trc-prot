import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatRoom } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.gurad';

import { ChatService } from './chat.service';
@UseGuards(JwtAuthGuard)
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
}

import { Controller, Get } from '@nestjs/common';
import { ChatRoom } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ChatService } from './chat.service';

@Controller('chat')
@ApiTags('/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'getChannels' })
  async getAllChannels(): Promise<ChatRoom[]> {
    return this.chatService.getAllChannels();
  }
}

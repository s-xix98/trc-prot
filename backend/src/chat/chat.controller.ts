import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom } from '@prisma/client';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  async getAllChannels(): Promise<ChatRoom[]> {
    return this.chatService.getAllChannels();
  }
}

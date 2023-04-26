import { Controller, Post } from '@nestjs/common';
import { Message } from '@prisma/client';
import { Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PostMessageService } from './post-message.service';
import { MessageDto } from './dto/message.dto';
@Controller('post-message')
@ApiTags('/post-message')
export class PostMessageController {
  constructor(private readonly postMessageService: PostMessageService) {}

  @Post()
  @ApiOperation({ summary: 'post message' })
  createMessage(@Body() dto: MessageDto): Promise<Message> {
    console.log('post-message :', dto);
    return this.postMessageService.postMessage(dto);
  }
}

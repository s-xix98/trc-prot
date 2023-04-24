import { Controller, Post } from '@nestjs/common';
import { Message } from '@prisma/client';
import { Body } from '@nestjs/common';

import { PostMessageService } from './post-message.service';
import { MessageDto } from './dto/message.dto';
@Controller('post-message')
export class PostMessageController {
  constructor(private readonly postMessageService: PostMessageService) {}

  // { //JSON
  // "content": "a",
  // "authorId": 1
  // }
  @Post()
  createMessage(@Body() dto: MessageDto): Promise<Message> {
    console.log('post-message :', dto);
    return this.postMessageService.postMessage(dto);
  }
}

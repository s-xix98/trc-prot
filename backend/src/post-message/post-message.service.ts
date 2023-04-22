import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from '@prisma/client';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class PostMessageService {
  constructor(private prisma: PrismaService) {}

  async postMessage(dto: MessageDto): Promise<Message> {
    const msg = await this.prisma.message.create({
      data: {
        authorId: dto.authorId,
        content: dto.content,
      },
    });
    return msg;
  }
}

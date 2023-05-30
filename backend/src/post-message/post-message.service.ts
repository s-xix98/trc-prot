import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { MessageDto } from './dto/message.dto';

@Injectable()
export class PostMessageService {
  constructor(private prisma: PrismaService) {}

  async postMessage(dto: MessageDto): Promise<Message> {
    // TODO 消す。roomIdをベタ打ちしてたけど、idがランダムになるから,部屋名で検索してidを取得する
    const room = await this.prisma.chatRoom.findUnique({
      where: { roomName: 'hogeRoom' },
    });
    const msg = await this.prisma.message.create({
      data: {
        userId: dto.authorId,
        content: dto.content,
        chatRoomId: room?.id || '',
      },
    });
    return msg;
  }
}

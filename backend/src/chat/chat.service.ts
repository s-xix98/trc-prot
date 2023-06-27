import { Injectable } from '@nestjs/common';
import { ChatRoom } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateChannelDto } from './dto/Channel.dto';
import { JoinChannelDto } from './dto/Channel.dto';
import { MessageDto } from './dto/message.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllChannels(): Promise<ChatRoom[]> {
    return this.prismaService.chatRoom.findMany();
  }

  async getChannelHistoryById(roomId: string) {
    const roomMsgs = await this.prismaService.message.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      where: {
        chatRoomId: roomId,
      },
    });

    return roomMsgs;
  }

  async findChannelById(roomId: string) {
    const room = await this.prismaService.chatRoom.findUnique({
      where: {
        id: roomId,
      },
    });
    return room;
  }

  async search(searchWord: string) {
    const partialMatchRooms = await this.prismaService.chatRoom.findMany({
      where: {
        roomName: {
          contains: searchWord,
          mode: 'insensitive',
        },
      },
    });

    const roomWithPasswordIndication = partialMatchRooms.map((room) => {
      const { hashedPassword, ...roomWithoutPassword } = room;

      return {
        ...roomWithoutPassword,
        hasPassword: hashedPassword ? true : false,
      };
    });

    return roomWithPasswordIndication;
  }

  async createChannel(dto: CreateChannelDto) {
    let hashedPassword = dto.password;
    if (dto.password) {
      hashedPassword = await bcrypt.hash(dto.password, 10);
    }
    const createdRoom = await this.prismaService.chatRoom.create({
      data: {
        roomName: dto.roomName,
        hashedPassword: hashedPassword,
      },
    });

    await this.prismaService.roomMember.create({
      data: {
        userId: dto.userId,
        chatRoomId: createdRoom.id,
      },
    });

    return createdRoom;
  }

  // TODO createだと２回createすると例外を投げるので一旦upsertにした
  async JoinChannel(dto: JoinChannelDto) {
    const room = await this.findChannelById(dto.chatRoomId);
    // TODO もうちょいちゃんとしたエラー投げる
    if (!room) {
      throw new Error('Room not found');
    }
    // TODO もうちょいちゃんとしたエラー投げる
    if (room.hashedPassword) {
      if (!dto.password) {
        throw new Error('Password is required');
      }

      const isMatch = await bcrypt.compare(dto.password, room.hashedPassword);
      if (!isMatch) {
        throw new Error('Password is incorrect');
      }
    }

    const roomMember = await this.prismaService.roomMember.upsert({
      where: {
        userId_chatRoomId: {
          userId: dto.userId,
          chatRoomId: dto.chatRoomId,
        },
      },
      update: {},
      create: {
        userId: dto.userId,
        chatRoomId: dto.chatRoomId,
      },
    });

    return roomMember;
  }

  async createMessage(dto: MessageDto) {
    const newMsg = await this.prismaService.message.create({
      data: {
        content: dto.content,
        userId: dto.userId,
        chatRoomId: dto.chatRoomId,
      },
    });

    return newMsg;
  }
}

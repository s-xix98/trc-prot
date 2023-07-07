import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChatRoom } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { CreateChannelDto, UpdateRoomMemberRoleDto } from './dto/Channel.dto';
import { JoinChannelDto } from './dto/Channel.dto';
import { MessageDto } from './dto/message.dto';
import { RoomMemberRestrictionDto } from './dto/Channel.dto';
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
        isPrivate: {
          equals: false,
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
    const createdRoom = await this.prismaService.chatRoom.create({
      data: {
        roomName: dto.roomName,
        hashedPassword: dto.password
          ? await bcrypt.hash(dto.password, 10)
          : undefined,
        isPrivate: dto.isPrivate,
      },
    });

    await this.prismaService.roomMember.create({
      data: {
        userId: dto.userId,
        chatRoomId: createdRoom.id,
        role: 'OWNER',
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

    if (room.hashedPassword !== null) {
      await this.verifyPassword(dto.password, room.hashedPassword);
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

  async verifyPassword(
    enteredPassword: string | undefined,
    hashedPassword: string,
  ) {
    // TODO もうちょいちゃんとしたエラー投げる
    if (enteredPassword === undefined) {
      throw new Error('Password is required');
    }

    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    if (!isMatch) {
      throw new Error('Password is incorrect');
    }
  }

  async findRoomMember(chatRoomId: string, userId: string) {
    const roomMember = await this.prismaService.roomMember.findUnique({
      where: {
        userId_chatRoomId: {
          userId,
          chatRoomId,
        },
      },
    });

    return roomMember;
  }

  async updateRoomMemberRole(
    roomId: string,
    targetId: string,
    userId: string,
    dto: UpdateRoomMemberRoleDto,
  ) {
    const owner = await this.findRoomMember(roomId, userId);

    if (owner === null || owner.role !== 'OWNER') {
      throw new ForbiddenException('You are not owner');
    }

    const target = await this.findRoomMember(roomId, targetId);

    if (target === null) {
      throw new ForbiddenException('Target not found');
    }

    return this.prismaService.roomMember.update({
      where: {
        userId_chatRoomId: {
          userId: targetId,
          chatRoomId: roomId,
        },
      },
      data: {
        role: dto.role,
      },
    });
  }

  async upsertRoomMemberState(dto: RoomMemberRestrictionDto, state: 'BANNED' | 'MUTED') {
    const memberState = this.prismaService.userChatState.upsert({
      where: {
        chatRoomId_userId_userState: {
          chatRoomId: dto.chatRoomId,
          userId: dto.targetId,
          userState: state,
        },
      },
      update: {
        endedAt: dto.endedAt,
      },
      create: {
        chatRoomId: dto.chatRoomId,
        userId: dto.targetId,
        userState: state,
        endedAt: dto.endedAt,
      },
    });

    return memberState;
  }

  async findRoomMemberState(
    roomId: string,
    userId: string,
    state: 'BANNED' | 'MUTED',
  ) {
    const memberState = this.prismaService.userChatState.findUnique({
      where: {
        chatRoomId_userId_userState: {
          chatRoomId: roomId,
          userId: userId,
          userState: state,
        },
      },
    });

    return memberState;
  }

  async findRoomMemberWithAdminCheck(chatRoomId: string, userId: string, targetId: string) {
    const admin = await this.findRoomMember(chatRoomId, userId);

    if (admin === null || admin.role === 'USER') {
      throw new Error('You are not ADMIN || OWNER');
    }

    const target = await this.findRoomMember(chatRoomId, targetId);

    if (target === null) {
      throw new Error('Target is not found');
    } else if (target.role === 'OWNER') {
      throw new Error('You can not ban or mute OWNER');
    }

    return target;
  }
}

import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChatRoom, Prisma, UserChatStateCode } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { UserInfo } from '../user/types/userInfo';
import { CustomException } from '../exceptions/custom.exception';

import {
  CreateChannelDto,
  UpdateChatRoomDto,
  UpdateRoomMemberRoleDto,
} from './dto/Channel.dto';
import { JoinChannelDto } from './dto/Channel.dto';
import { RoomMemberRestrictionDto } from './dto/Channel.dto';
import { MessageDto } from './dto/message.dto';

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
            base64Image: true,
          },
        },
      },
      where: {
        chatRoomId: roomId,
      },
    });

    return roomMsgs;
  }

  async getRoomMembersById(roomId: string): Promise<UserInfo[]> {
    const roomMembers = await this.prismaService.roomMember.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            base64Image: true,
          },
        },
      },
      where: {
        chatRoomId: roomId,
      },
    });

    return roomMembers.map((member) => member.user);
  }

  async findChannelById(roomId: string) {
    const room = await this.prismaService.chatRoom.findUnique({
      where: {
        id: roomId,
      },
    });
    return room;
  }

  async findInvitation(
    inviteeUserId: string,
    inviterUserId: string,
    chatRoomId: string,
  ) {
    const invitation = await this.prismaService.chatInvitation.findUnique({
      where: {
        inviteeUserId_inviterUserId_chatRoomId: {
          inviteeUserId,
          inviterUserId,
          chatRoomId,
        },
      },
    });

    return invitation;
  }

  async deleteInvitation(
    inviteeUserId: string,
    inviterUserId: string,
    chatRoomId: string,
  ) {
    const { count } = await this.prismaService.chatInvitation.deleteMany({
      where: {
        inviteeUserId,
        inviterUserId,
        chatRoomId,
      },
    });

    return count;
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
        isDM: {
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

    return createdRoom;
  }

  async createDM(userId: string, targetId: string) {
    return this.prismaService.$transaction(
      async (tx) => {
        const createdRoom = await tx.chatRoom.create({
          data: {
            roomName: 'DM',
            isPrivate: true,
            isDM: true,
            roomMembers: {
              create: [
                {
                  userId: userId,
                  role: UserRole.USER,
                },
                {
                  userId: targetId,
                  role: UserRole.USER,
                },
              ],
            },
          },
        });

        return createdRoom;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async upsertRoomMember(chatRoomId: string, userId: string, role: UserRole) {
    const roomMember = await this.prismaService.roomMember.upsert({
      where: {
        userId_chatRoomId: {
          userId: userId,
          chatRoomId: chatRoomId,
        },
      },
      update: {},
      create: {
        userId: userId,
        chatRoomId: chatRoomId,
        role: role,
      },
    });

    return roomMember;
  }

  async createRoomMember(chatRoomId: string, userId: string, role: UserRole) {
    const roomMember = await this.prismaService.roomMember.create({
      data: {
        userId,
        chatRoomId,
        role,
      },
    });

    return roomMember;
  }

  async deleteRoomMember(chatRoomId: string, userId: string) {
    const { count } = await this.prismaService.roomMember.deleteMany({
      where: {
        userId,
        chatRoomId,
      },
    });

    return count;
  }

  // TODO createだと２回createすると例外を投げるので一旦upsertにした
  async JoinChannel(dto: JoinChannelDto, userId: string) {
    const room = await this.findChannelById(dto.chatRoomId);
    // TODO もうちょいちゃんとしたエラー投げる
    if (!room) {
      throw new CustomException('Room not found');
    }

    if (room.hashedPassword !== null) {
      await this.verifyPassword(dto.password, room.hashedPassword);
    }

    let roomMember = await this.findRoomMember(room.id, userId);
    if (!roomMember) {
      roomMember = await this.createRoomMember(room.id, userId, 'USER');
    }
    return roomMember;
  }

  async createMessage(dto: MessageDto, userId: string) {
    const newMsg = await this.prismaService.message.create({
      data: {
        content: dto.content,
        userId: userId,
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
      throw new CustomException('Password is required');
    }

    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    if (!isMatch) {
      throw new CustomException('Password is incorrect');
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

  async upsertRoomMemberState(
    dto: RoomMemberRestrictionDto,
    state: 'BANNED' | 'MUTED',
  ) {
    const endedAt = new Date(Date.now() + dto.duration * 1000 * 60);

    const memberState = await this.prismaService.userChatState.upsert({
      where: {
        chatRoomId_userId_userState: {
          chatRoomId: dto.chatRoomId,
          userId: dto.targetId,
          userState: state,
        },
      },
      update: {
        endedAt: endedAt,
      },
      create: {
        chatRoomId: dto.chatRoomId,
        userId: dto.targetId,
        userState: state,
        endedAt: endedAt,
      },
    });

    return memberState;
  }

  async findRoomMemberState(
    roomId: string,
    userId: string,
    state: UserChatStateCode,
  ) {
    const memberState = await this.prismaService.userChatState.findUnique({
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

  async getJoinedRooms(userId: string) {
    const joinedRooms = await this.prismaService.chatRoom.findMany({
      where: {
        roomMembers: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        roomName: true,
        isPrivate: true,
        hashedPassword: true,
        isDM: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return joinedRooms.map((room) => {
      const { hashedPassword, ...rest } = room;
      return {
        ...rest,
        hasPassword: hashedPassword !== null,
      };
    });
  }

  async upsertInvitation(
    inviteeId: string,
    inviterId: string,
    chatRoomId: string,
  ) {
    const invitation = await this.prismaService.chatInvitation.upsert({
      where: {
        inviteeUserId_inviterUserId_chatRoomId: {
          inviteeUserId: inviteeId,
          inviterUserId: inviterId,
          chatRoomId: chatRoomId,
        },
      },
      update: {},
      create: {
        inviteeUserId: inviteeId,
        inviterUserId: inviterId,
        chatRoomId: chatRoomId,
      },
    });

    return invitation;
  }

  async getInvites(userId: string) {
    const invites = await this.prismaService.chatInvitation.findMany({
      where: {
        inviteeUserId: userId,
      },
      include: {
        chatRoom: {
          select: {
            id: true,
            roomName: true,
          },
        },
        inviter: {
          select: {
            id: true,
            username: true,
            base64Image: true,
          },
        },
      },
    });

    return invites.map((invite) => {
      const { chatRoom, inviter } = invite;
      return {
        chatRoom,
        inviter,
      };
    });
  }

  async updateChatRoom(dto: UpdateChatRoomDto) {
    let pwd: string | null | undefined;

    if (dto.password === null) {
      pwd = null;
    } else if (dto.password !== undefined) {
      pwd = await bcrypt.hash(dto.password, 10);
    }

    const room = await this.prismaService.chatRoom.update({
      where: {
        id: dto.chatRoomId,
      },
      data: {
        roomName: dto.roomName,
        hashedPassword: pwd,
        isPrivate: dto.isPrivate,
      },
    });

    return room;
  }

  async roomExists(roomId: string) {
    const room = await this.findChannelById(roomId);
    return room !== null;
  }

  async roomMemberExists(roomId: string, userId: string) {
    const roomMember = await this.findRoomMember(roomId, userId);
    return roomMember !== null;
  }

  async userRestrictionExists(
    roomId: string,
    userId: string,
    state: UserChatStateCode,
  ) {
    const userState = await this.findRoomMemberState(roomId, userId, state);

    const now = new Date();
    if (userState && userState.endedAt > now) {
      return true;
    }

    return false;
  }

  async isUserQualified(roomId: string, userId: string) {
    const requestUser = await this.findRoomMember(roomId, userId);

    if (requestUser === null || requestUser.role === 'USER') {
      return false;
    }

    return true;
  }

  async isOwner(roomId: string, userId: string) {
    const target = await this.findRoomMember(roomId, userId);

    if (target && target.role === 'OWNER') {
      return true;
    }
    return false;
  }

  async dmExists(userId: string, targetId: string) {
    const dm = await this.prismaService.chatRoom.findMany({
      where: {
        AND: [
          { roomMembers: { some: { userId: userId } } },
          { roomMembers: { some: { userId: targetId } } },
          { isDM: true },
        ],
      },
    });

    return dm.length > 0;
  }
}

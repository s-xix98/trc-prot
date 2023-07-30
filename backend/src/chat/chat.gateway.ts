import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { roomType } from '../wsocket/utils';
import { WsocketGateway } from '../wsocket/wsocket.gateway';
import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';
import { UserService } from '../user/user.service';
import { CustomException } from '../exceptions/custom.exception';

import { MessageDto } from './dto/message.dto';
import {
  AcceptChatInvitationDto,
  CreateChannelDto,
  InviteChatRoomDto,
  JoinChannelDto,
  LeaveRoomDto,
  RoomMemberRestrictionDto,
  RejectChatInvitationDto,
  UpdateChatRoomDto,
  KickRoomMemberRDto,
} from './dto/Channel.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(new WsExceptionsFilter())
export class ChatGateway {
  constructor(
    private prisma: PrismaService,
    private server: WsocketGateway,
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    // TODO jwtができたら接続時にdbに保存されてる所属しているチャンネルに全てにclient.joinする
    console.log('chat Connection');
    console.log(client.id);

    const token = client.handshake.auth.token;
    if (!token) {
      return;
    }

    const userId = this.server.extractUserIdFromToken(token);
    if (!userId) {
      return;
    }
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return;
      }

      const joinedRooms = await this.chatService.getJoinedRooms(userId);
      client.emit('joinedRooms', joinedRooms);

      this.sendInvites(userId);

      joinedRooms.forEach((room) => {
        this.server.JoinRoom(client, roomType.Chat, room.id);
      });
    } catch (e) {
      console.log(e);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('chat Disconnection');
    console.log(client.id);
  }
  @SubscribeMessage('createChannel')
  async createChannel(client: Socket, dto: CreateChannelDto) {
    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    const createdRoom = await this.chatService.createChannel(dto);
    await this.chatService.upsertRoomMember(createdRoom.id, userId, 'OWNER');

    this.server.JoinRoom(client, roomType.Chat, createdRoom.id);
    await this.sendJoinedRooms(userId);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, dto: JoinChannelDto) {
    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    const restrictionExists = await this.chatService.userRestrictionExists(
      dto.chatRoomId,
      userId,
      'BANNED',
    );
    if (restrictionExists) {
      throw new CustomException('You are banned');
    }

    const addedUser = await this.chatService.JoinChannel(dto, userId);

    this.server.JoinRoom(client, roomType.Chat, addedUser.chatRoomId);

    await this.sendJoinedRooms(addedUser.userId);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, dto: MessageDto) {
    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    const restrictionExists = await this.chatService.userRestrictionExists(
      dto.chatRoomId,
      userId,
      'MUTED',
    );
    if (restrictionExists) {
      throw new CustomException('You are muted');
    }

    const msg = await this.chatService.createMessage(dto, userId);

    this.broadcastRoomMessageHistory(msg.chatRoomId);
  }

  @SubscribeMessage('banRoomMember')
  async banRoomMember(client: Socket, dto: RoomMemberRestrictionDto) {
    console.log('banRoomMember', dto);
    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    const reqUserExists = await this.userService.userExists(userId);
    const targetUserExists = await this.userService.userExists(dto.targetId);
    if (!reqUserExists || !targetUserExists) {
      throw new CustomException('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    const isQualifiedUser = await this.chatService.isUserQualified(
      dto.chatRoomId,
      userId,
    );
    if (!isQualifiedUser) {
      throw new CustomException('You are not ADMIN || OWNER');
    }

    const isOwner = await this.chatService.isOwner(
      dto.chatRoomId,
      dto.targetId,
    );
    if (isOwner) {
      throw new CustomException('you can not restrict this user');
    }

    await this.chatService.upsertRoomMemberState(dto, 'BANNED');
    await this.chatService.deleteRoomMember(dto.chatRoomId, dto.targetId);

    const targetSock = this.server.getSocket(dto.targetId);
    if (targetSock) {
      this.server.LeaveRoom(targetSock, roomType.Chat, dto.chatRoomId);
      await this.sendJoinedRooms(dto.targetId);
    }
  }

  @SubscribeMessage('muteRoomMember')
  async muteRoomMember(client: Socket, dto: RoomMemberRestrictionDto) {
    console.log('muteRoomMember', dto);
    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    const reqUserExists = await this.userService.userExists(userId);
    const targetUserExists = await this.userService.userExists(dto.targetId);
    if (!reqUserExists || !targetUserExists) {
      throw new CustomException('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    const isQualifiedUser = await this.chatService.isUserQualified(
      dto.chatRoomId,
      userId,
    );
    if (!isQualifiedUser) {
      throw new CustomException('You are not ADMIN || OWNER');
    }

    const isOwner = await this.chatService.isOwner(dto.chatRoomId, userId);
    if (isOwner) {
      throw new CustomException('you can not restrict this user');
    }

    await this.chatService.upsertRoomMemberState(dto, 'MUTED');
  }

  @SubscribeMessage('kickRoomMember')
  async kickRoomMember(client: Socket, dto: KickRoomMemberRDto) {
    console.log('kickRoomMember', dto);
    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    const reqUserExists = await this.userService.userExists(userId);
    const targetUserExists = await this.userService.userExists(dto.targetId);
    if (!reqUserExists || !targetUserExists) {
      throw new CustomException('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    const isQualifiedUser = await this.chatService.isUserQualified(
      dto.chatRoomId,
      userId,
    );
    if (!isQualifiedUser) {
      throw new CustomException('You are not ADMIN || OWNER');
    }

    const isOwner = await this.chatService.isOwner(dto.chatRoomId, userId);
    if (isOwner) {
      throw new CustomException('you can not restrict this user');
    }

    await this.chatService.deleteRoomMember(dto.chatRoomId, dto.targetId);

    const targetSock = this.server.getSocket(dto.targetId);
    if (targetSock) {
      this.server.LeaveRoom(targetSock, roomType.Chat, dto.chatRoomId);
      await this.sendJoinedRooms(dto.targetId);
    }
  }

  @SubscribeMessage('inviteChatRoom')
  async inviteRoom(client: Socket, dto: InviteChatRoomDto) {
    console.log('inviteChatRoom', dto);

    const inviterId = this.server.getUserId(client);
    if (!inviterId) {
      throw new CustomException('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    const roomMemberExists = await this.chatService.roomMemberExists(
      dto.chatRoomId,
      inviterId,
    );
    if (!roomMemberExists) {
      throw new CustomException('You are not member of this room');
    }

    await this.chatService.upsertInvitation(
      dto.targetId,
      inviterId,
      dto.chatRoomId,
    );

    await this.sendInvites(dto.targetId);
  }

  async sendInvites(userId: string) {
    const socket = this.server.getSocket(userId);
    if (socket) {
      const invites = await this.chatService.getInvites(userId);
      socket.emit('receiveInviteChatRoom', invites);
    }
  }

  @SubscribeMessage('acceptChatInvitation')
  async acceptChatInvitation(client: Socket, dto: AcceptChatInvitationDto) {
    console.log('acceptChatInvitation', dto);

    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    const invitation = await this.chatService.findInvitation(
      userId,
      dto.inviterId,
      dto.chatRoomId,
    );
    if (!invitation) {
      throw new CustomException('Invitation is not found');
    }

    const roomMemberExists = await this.chatService.roomMemberExists(
      dto.chatRoomId,
      userId,
    );
    if (!roomMemberExists) {
      await this.chatService.createRoomMember(dto.chatRoomId, userId, 'USER');
    }

    await this.chatService.deleteInvitation(
      userId,
      dto.inviterId,
      dto.chatRoomId,
    );

    this.server.JoinRoom(client, roomType.Chat, dto.chatRoomId);
    await this.sendInvites(userId);
    await this.sendJoinedRooms(userId);
  }

  @SubscribeMessage('rejectChatInvitation')
  async RejectChatRoomInvitation(client: Socket, dto: RejectChatInvitationDto) {
    console.log('rejectChatInvitation', dto);

    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    await this.chatService.deleteInvitation(
      userId,
      dto.inviterId,
      dto.chatRoomId,
    );

    await this.sendInvites(userId);
  }

  @SubscribeMessage('leaveChatRoom')
  async leaveRoom(client: Socket, dto: LeaveRoomDto) {
    console.log('leaveChatRoom', dto);

    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    await this.chatService.deleteRoomMember(dto.chatRoomId, userId);

    this.server.LeaveRoom(client, roomType.Chat, dto.chatRoomId);
    await this.sendJoinedRooms(userId);
  }

  @SubscribeMessage('updateChatRoom')
  async updateChatRoom(client: Socket, dto: UpdateChatRoomDto) {
    console.log('updateChatRoom', dto);

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new CustomException('Room is not found');
    }

    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new CustomException('User is not found');
    }

    const isOwner = await this.chatService.isOwner(dto.chatRoomId, userId);
    if (!isOwner) {
      throw new CustomException('You are not owner');
    }

    await this.chatService.updateChatRoom(dto);
    await this.broadcastRoomsToMembers(dto.chatRoomId);
  }

  async broadcastRoomsToMembers(roomId: string) {
    const members = await this.chatService.getRoomMembersById(roomId);
    await Promise.all(
      members.map(async (member) => this.sendJoinedRooms(member.id)),
    );
  }

  async broadcastMessagesToJoinedRooms(userId: string) {
    const rooms = await this.chatService.getJoinedRooms(userId);
    await Promise.all(
      rooms.map((room) => this.broadcastRoomMessageHistory(room.id)),
    );
  }

  private async broadcastRoomMessageHistory(roomId: string) {
    const msgs = await this.chatService.getChannelHistoryById(roomId);
    this.server.to(roomType.Chat, roomId).emit('receiveMessage', msgs);
  }

  private async sendJoinedRooms(userId: string) {
    const socket = this.server.getSocket(userId);
    if (socket) {
      const joinedRooms = await this.chatService.getJoinedRooms(userId);
      socket.emit('joinedRooms', joinedRooms);
    }
  }
}

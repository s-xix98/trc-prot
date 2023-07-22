import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { roomType } from '../wsocket/utils';
import { WsocketGateway } from '../wsocket/wsocket.gateway';
import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';
import { UserService } from '../user/user.service';

import { MessageDto } from './dto/message.dto';
import {
  CreateChannelDto,
  InviteChatRoomDto,
  JoinChannelDto,
  LeaveRoomDto,
  RoomMemberRestrictionDto,
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
    const exists = await this.userService.userExists(dto.userId);
    if (!exists) {
      throw new Error('User is not found');
    }

    const createdRoom = await this.chatService.createChannel(dto);
    await this.chatService.upsertRoomMember(
      createdRoom.id,
      dto.userId,
      'OWNER',
    );
    const joinedRooms = await this.chatService.getJoinedRooms(dto.userId);

    this.server.JoinRoom(client, roomType.Chat, createdRoom.id);
    client.emit('joinedRooms', joinedRooms);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, dto: JoinChannelDto) {
    const userExists = await this.userService.userExists(dto.userId);
    if (!userExists) {
      throw new Error('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new Error('Room is not found');
    }

    const restrictionExists = await this.chatService.userRestrictionExists(
      dto.chatRoomId,
      dto.userId,
      'BANNED',
    );
    if (restrictionExists) {
      throw new Error('You are banned');
    }

    const addedUser = await this.chatService.JoinChannel(dto);

    this.server.JoinRoom(client, roomType.Chat, addedUser.chatRoomId);
    this.server
      .to(roomType.Chat, addedUser.chatRoomId)
      .emit('joinChannel', addedUser);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, dto: MessageDto) {
    const userExists = await this.userService.userExists(dto.userId);
    if (!userExists) {
      throw new Error('User is not found');
    }

    const roomExists = await this.chatService.roomExists(dto.chatRoomId);
    if (!roomExists) {
      throw new Error('Room is not found');
    }

    const restrictionExists = await this.chatService.userRestrictionExists(
      dto.chatRoomId,
      dto.userId,
      'MUTED',
    );
    if (restrictionExists) {
      throw new Error('You are muted');
    }

    const msg = await this.chatService.createMessage(dto);

    const roomMsgs = await this.chatService.getChannelHistoryById(
      msg.chatRoomId,
    );

    this.server
      .to(roomType.Chat, msg.chatRoomId)
      .emit('receiveMessage', roomMsgs);
  }

  @SubscribeMessage('banRoomMember')
  async banRoomMember(client: Socket, dto: RoomMemberRestrictionDto) {
    console.log('banRoomMember', dto);

    const requestUser = await this.chatService.findRoomMember(
      dto.chatRoomId,
      dto.userId,
    );

    if (requestUser === null || requestUser.role === 'USER') {
      throw new Error('You are not ADMIN || OWNER');
    }

    const target = await this.chatService.findRoomMember(
      dto.chatRoomId,
      dto.targetId,
    );

    if (target === null) {
      throw new Error('Target is not found');
    } else if (target.role === 'OWNER') {
      throw new Error('You can not ban or mute OWNER');
    }

    await this.chatService.upsertRoomMemberState(dto, 'BANNED');

    const { count } = await this.prisma.roomMember.deleteMany({
      where: {
        userId: target.userId,
        chatRoomId: dto.chatRoomId,
      },
    });

    if (count > 0) {
      // TODO targetを消す
      // client.emit('deleteRoom', targetState);
      // this.server.LeaveRoom(client, roomType.Chat, dto.chatRoomId);
    }
  }

  @SubscribeMessage('muteRoomMember')
  async muteRoomMember(client: Socket, dto: RoomMemberRestrictionDto) {
    console.log('muteRoomMember', dto);

    const requestUser = await this.chatService.findRoomMember(
      dto.chatRoomId,
      dto.userId,
    );

    if (requestUser === null || requestUser.role === 'USER') {
      throw new Error('You are not ADMIN || OWNER');
    }

    const target = await this.chatService.findRoomMember(
      dto.chatRoomId,
      dto.targetId,
    );

    if (target === null) {
      throw new Error('Target is not found');
    } else if (target.role === 'OWNER') {
      throw new Error('You can not ban or mute OWNER');
    }

    await this.chatService.upsertRoomMemberState(dto, 'MUTED');
  }

  @SubscribeMessage('kickRoomMember')
  async kickRoomMember(client: Socket, dto: RoomMemberRestrictionDto) {
    console.log('kickRoomMember', dto);

    const requestUser = await this.chatService.findRoomMember(
      dto.chatRoomId,
      dto.userId,
    );

    if (requestUser === null || requestUser.role === 'USER') {
      throw new Error('You are not ADMIN || OWNER');
    }

    const target = await this.chatService.findRoomMember(
      dto.chatRoomId,
      dto.targetId,
    );

    if (target === null) {
      throw new Error('Target is not found');
    } else if (target.role === 'OWNER') {
      throw new Error('You can not ban or mute OWNER');
    }

    const { count } = await this.prisma.roomMember.deleteMany({
      where: {
        userId: target.userId,
        chatRoomId: dto.chatRoomId,
      },
    });

    if (count > 0) {
      // TODO targetを消す
      // client.emit('deleteRoom', targetState);
      // this.server.LeaveRoom(client, roomType.Chat, dto.chatRoomId);
    }
  }

  @SubscribeMessage('inviteChatRoom')
  async inviteRoom(client: Socket, dto: InviteChatRoomDto) {
    console.log('inviteChatRoom', dto);

    const requestUserId = this.server.getUserId(client);
    if (!requestUserId) {
      throw new Error();
    }

    const room = await this.chatService.findChannelById(dto.chatRoomId);
    if (!room) {
      throw new Error('Room is not found');
    }

    const requestUser = await this.chatService.findRoomMember(
      room.id,
      requestUserId,
    );
    if (!requestUser) {
      throw new Error('You are not member of this room');
    }

    await this.chatService.upsertInvitation(
      dto.targetId,
      requestUserId,
      room.id,
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

  @SubscribeMessage('leaveChatRoom')
  async leaveRoom(client: Socket, dto: LeaveRoomDto) {
    console.log('leaveChatRoom', dto);

    const userId = this.server.getUserId(client);
    if (!userId) {
      throw new Error();
    }

    const room = await this.chatService.findChannelById(dto.chatRoomId);
    if (!room) {
      throw new Error('Room is not found');
    }

    await this.prisma.roomMember.delete({
      where: {
        userId_chatRoomId: {
          userId,
          chatRoomId: dto.chatRoomId,
        },
      },
    });

    this.server.LeaveRoom(client, roomType.Chat, dto.chatRoomId);
    const joinedRooms = await this.chatService.getJoinedRooms(userId);
    client.emit('joinedRooms', joinedRooms);
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
}

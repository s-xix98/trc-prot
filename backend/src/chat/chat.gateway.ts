import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { roomType } from '../wsocket/utils';
import { WsocketGateway } from '../wsocket/wsocket.gateway';
import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';

import { MessageDto } from './dto/message.dto';
import {
  CreateChannelDto,
  JoinChannelDto,
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

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return;
    }

    const joinedRooms = await this.chatService.getJoinedRooms(userId);
    client.emit('joinedRooms', joinedRooms);

    joinedRooms.forEach((room) => {
      this.server.JoinRoom(client, roomType.Chat, room.id);
    });
  }

  handleDisconnect(client: Socket) {
    console.log('chat Disconnection');
    console.log(client.id);
  }
  @SubscribeMessage('createChannel')
  async createChannel(client: Socket, dto: CreateChannelDto) {
    const createdRoom = await this.chatService.createChannel(dto);
    const joinedRooms = await this.chatService.getJoinedRooms(dto.userId);

    this.server.JoinRoom(client, roomType.Chat, createdRoom.id);
    client.emit('joinedRooms', joinedRooms);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, dto: JoinChannelDto) {
    const userState = await this.chatService.findRoomMemberState(
      dto.chatRoomId,
      dto.userId,
      'BANNED',
    );

    const now = new Date();

    if (userState && userState.endedAt > now) {
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
    const userState = await this.chatService.findRoomMemberState(
      dto.chatRoomId,
      dto.userId,
      'MUTED',
    );

    const now = new Date();

    if (userState && userState.endedAt > now) {
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
}

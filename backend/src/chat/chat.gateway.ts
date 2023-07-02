import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { roomType } from '../wsocket/utils';
import { WsocketGateway } from '../wsocket/wsocket.gateway';
import { WsExceptionsFilter } from '../filters/ws-exceptions.filter';

import { MessageDto } from './dto/message.dto';
import { CreateChannelDto, JoinChannelDto, RoomMemberRestrictionDto } from './dto/Channel.dto';
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

    // handleConnection(client: Socket)の引数にデータを渡すにはクライアント側のURLパスにクエリを追加しないといけないから
    // 元々あるhugaで代用
    // jwt導入次第削除
    const huga = await this.prisma.user.findUnique({
      where: {
        username: 'huga',
      },
    });

    if (!huga) {
      return;
    }
    const roomIds = await this.prisma.roomMember.findMany({
      where: {
        userId: huga.id,
      },
    });

    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        id: {
          in: roomIds.map((room) => room.chatRoomId),
        },
      },
    });

    rooms.forEach((room) => {
      this.server.JoinRoom(client, roomType.Chat, room.id);
      client.emit('addRoom', room);
    });
  }

  handleDisconnect(client: Socket) {
    console.log('chat Disconnection');
    console.log(client.id);
  }
  @SubscribeMessage('createChannel')
  async createChannel(client: Socket, dto: CreateChannelDto) {
    const createdRoom = await this.chatService.createChannel(dto);

    this.server.JoinRoom(client, roomType.Chat, createdRoom.id);
    client.emit('addRoom', createdRoom);
    client.broadcast.emit('addRoom', createdRoom);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, dto: JoinChannelDto) {
    const addedUser = await this.chatService.JoinChannel(dto);

    this.server.JoinRoom(client, roomType.Chat, addedUser.chatRoomId);
    this.server
      .to(roomType.Chat, addedUser.chatRoomId)
      .emit('joinChannel', addedUser);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, dto: MessageDto) {
    const msg = await this.chatService.createMessage(dto);

    const roomMsgs = await this.chatService.getChannelHistoryById(
      msg.chatRoomId,
    );

    this.server
      .to(roomType.Chat, msg.chatRoomId)
      .emit('receiveMessage', roomMsgs);
  }

  @SubscribeMessage('banOrMuteRoomMember')
  async banOrMuteRoomMember(client: Socket, dto: RoomMemberRestrictionDto) {
    console.log('banOrMuteRoomMember', dto);

    const admin = await this.chatService.findRoomMember(dto.chatRoomId, dto.userId);

    if (admin === null || admin.role === 'USER') {
      throw new Error('You are not ADMIN || OWNER');
    }
    const state = await this.prisma.userChatState.upsert({
      where: {
        chatRoomId_userId_userState: {
          chatRoomId: dto.chatRoomId,
          userId: dto.userId,
          userState: dto.state,
        },
      },
      update: {
        endedAt: dto.endedAt,
      },
      create: {
        chatRoomId: dto.chatRoomId,
        userId: dto.targetId,
        endedAt: dto.endedAt,
        userState: dto.state,
      },
    });
  }
}

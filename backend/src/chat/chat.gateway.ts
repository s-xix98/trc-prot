import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { PrismaService } from '../prisma/prisma.service';
import { roomType } from '../wsocket/utils';
import { WsocketGateway } from '../wsocket/wsocket.gateway';

import { MessageDto } from './dto/message.dto';
import { CreateChannelDto, JoinChannelDto } from './dto/Channel.dto';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private prisma: PrismaService, private server: WsocketGateway) {}

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
  async createChannel(client: Socket, createChannelDto: CreateChannelDto) {
    const createdRoom = await this.prisma.chatRoom.create({
      data: {
        roomName: createChannelDto.roomName,
      },
    });
    await this.prisma.roomMember.create({
      data: {
        userId: createChannelDto.userId,
        chatRoomId: createdRoom.id,
      },
    });
    this.server.JoinRoom(client, roomType.Chat, createdRoom.id);
    client.emit('addRoom', createdRoom);
    client.broadcast.emit('addRoom', createdRoom);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, joinChannelDto: JoinChannelDto) {
    // TODO createだと２回createすると例外を投げるので一旦upsertにした
    const addedUser = await this.prisma.roomMember.upsert({
      where: {
        userId_chatRoomId: {
          userId: joinChannelDto.userId,
          chatRoomId: joinChannelDto.chatRoomId,
        },
      },
      update: {},
      create: {
        userId: joinChannelDto.userId,
        chatRoomId: joinChannelDto.chatRoomId,
      },
    });

    this.server.JoinRoom(client, roomType.Chat, addedUser.chatRoomId);
    this.server
      .to(roomType.Chat, addedUser.chatRoomId)
      .emit('joinChannel', addedUser);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, messageDto: MessageDto) {
    const msg = await this.prisma.message.create({
      data: {
        content: messageDto.content,
        userId: messageDto.userId,
        chatRoomId: messageDto.chatRoomId,
      },
    });
    const roomMsgs = await this.prisma.message.findMany({
      select: {
        content: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      where: {
        chatRoomId: messageDto.chatRoomId,
      },
    });
    this.server.to(roomType.Chat, msg.chatRoomId).emit('sendMessage', roomMsgs);
  }
}

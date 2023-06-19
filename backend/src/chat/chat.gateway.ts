import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { PrismaService } from '../prisma/prisma.service';

import { MessageDto } from './dto/message.dto';
import { CreateChannelDto, JoinChannelDto } from './dto/Channel.dto';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(private prisma: PrismaService) {}

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
      client.join(room.id.toString());
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
    client.join(createdRoom.id.toString());
    this.server.emit('addRoom', createdRoom);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, joinChannelDto: JoinChannelDto) {
    const addedUser = await this.prisma.roomMember.create({
      data: {
        userId: joinChannelDto.userId,
        chatRoomId: joinChannelDto.chatRoomId,
      },
    });
    client.join(addedUser.chatRoomId.toString());
    this.server
      .to(addedUser.chatRoomId.toString())
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
    this.server.to(msg.chatRoomId.toString()).emit('sendMessage', roomMsgs);
  }
}

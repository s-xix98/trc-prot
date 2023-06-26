import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { PrismaService } from '../prisma/prisma.service';
import { roomType } from '../wsocket/utils';
import { WsocketGateway } from '../wsocket/wsocket.gateway';

import { MessageDto } from './dto/message.dto';
import { CreateChannelDto, JoinChannelDto } from './dto/Channel.dto';
import { ChatService } from './chat.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private prisma: PrismaService, private server: WsocketGateway, private chatService: ChatService) {}

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
    const createdRoom = await this.chatService.createChannel(createChannelDto);

    this.server.JoinRoom(client, roomType.Chat, createdRoom.id);
    client.emit('addRoom', createdRoom);
    client.broadcast.emit('addRoom', createdRoom);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, joinChannelDto: JoinChannelDto) {
    const addedUser = await this.chatService.JoinChannel(joinChannelDto);

    this.server.JoinRoom(client, roomType.Chat, addedUser.chatRoomId);
    this.server
      .to(roomType.Chat, addedUser.chatRoomId)
      .emit('joinChannel', addedUser);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, messageDto: MessageDto) {
    const msg = await this.chatService.createMessage(messageDto);

    const roomMsgs = await this.chatService.getChannelHistoryById(msg.chatRoomId);

    this.server.to(roomType.Chat, msg.chatRoomId).emit('sendMessage', roomMsgs);
  }
}

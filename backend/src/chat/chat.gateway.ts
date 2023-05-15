import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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
  handleConnection(client: Socket) {
    // TODO jwtができたら接続時にdbに保存されてる所属しているチャンネルに全てにclient.joinする
    console.log('chat Connection');
  }
  handleDisconnect(client: Socket) {
    console.log('chat Disconnection');
  }
  @SubscribeMessage('createChannel')
  async createChannel(client:Socket, createChannelDto: CreateChannelDto){
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
    this.server.to(msg.chatRoomId.toString()).emit('sendMessage', msg);
  }
}

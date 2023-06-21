import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { PrismaService } from '../prisma/prisma.service';

import { handleMessageDto } from './dto/event.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private prisma: PrismaService) {}

  wsClients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    console.log('handleConnection');
    // TODO : assert cliend id has
    this.wsClients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log('handleDisconnect');
    this.wsClients.delete(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: handleMessageDto): string {
    console.log('message', payload);
    for (const c of this.wsClients.values()) {
      c.emit('message', payload);
    }
    return 'Hello world!';
  }
}

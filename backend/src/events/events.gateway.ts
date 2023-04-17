import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
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
  handleMessage(_client: any, _payload: any): string {
    return 'Hello world!';
  }
}

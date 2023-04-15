import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  handleConnection(client: any) {
    console.log('handleConnection', client);
  }

  handleDisconnect(client: any) {
    console.log('handleDisconnect', client);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}

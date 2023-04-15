import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  handleConnection(client: any) {
    console.log('handleConnection');
  }

  handleDisconnect(client: any) {
    console.log('handleDisconnect');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}

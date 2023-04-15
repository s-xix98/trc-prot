import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  handleConnection(_client: any) {
    console.log('handleConnection');
  }

  handleDisconnect(_client: any) {
    console.log('handleDisconnect');
  }

  @SubscribeMessage('message')
  handleMessage(_client: any, _payload: any): string {
    return 'Hello world!';
  }
}

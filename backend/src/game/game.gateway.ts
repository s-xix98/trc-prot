import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class GameGateway {
  handleConnection() {
    console.log('game connection');
  }
  }
}

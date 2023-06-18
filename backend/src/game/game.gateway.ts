import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class GameGateway {
  handleConnection() {
    console.log('game connection');
  }
  // stub
  @SubscribeMessage('matchmake')
  matchmake(client: Socket, user: UserInfo) {
    console.log('mathmake')
  }
  }
}

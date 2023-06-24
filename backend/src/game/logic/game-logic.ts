import { Socket } from 'socket.io';

import { Ball } from '../types.d';
import { CreateBall } from '../game-constants';
import { GameDto } from '../dto/GameDto';

export class GameLogic {
  private ball: Ball;
  private p1: Socket;
  private p2: Socket;
  private intervalId: any;

  constructor(p1: Socket, p2: Socket, ball: Ball = CreateBall()) {
    this.ball = ball;
    this.p1 = p1;
    this.p2 = p2;
  }

  StartGame() {
    console.log('start game loop');
    this.intervalId = setInterval(() => {
      this.UpdateBallPosition();
      const gameDto: GameDto = { ball: this.ball };
      console.log(gameDto.ball);
      this.p1.emit('game data', gameDto);
      //   this.p2.emit('game data', gameDto);
    }, 10);
  }

  EndGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private UpdateBallPosition() {
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
  }
}

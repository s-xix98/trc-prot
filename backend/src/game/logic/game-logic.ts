import { Socket } from 'socket.io';

import { Ball, Paddle } from '../types.d';
import { CreateBall, CreatePaddle } from '../game-constants';
import { GameDto } from '../dto/GameDto';

const IsInRange = (pos: number, start: number, end: number) => {
  return start < pos && pos < end;
};

export class GameLogic {
  private ball: Ball;
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;
  private p1: Socket;
  private p2: Socket;
  private intervalId: any;

  constructor(p1: Socket, p2: Socket, ball: Ball = CreateBall()) {
    this.ball = ball;
    this.p1 = p1;
    this.p2 = p2;
    this.leftPaddle = CreatePaddle(0);
    this.rightPaddle = CreatePaddle(1);
  }

  StartGame() {
    console.log('start game loop');
    this.intervalId = setInterval(() => {
      this.UpdateBallPosition();
      const gameDto: GameDto = {
        ball: this.ball,
        leftPaddle: this.leftPaddle,
        rightPaddle: this.rightPaddle,
      };
      // console.log(gameDto);
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
    if (!IsInRange(this.ball.y + this.ball.dy, 0, 1)) {
      this.ball.dy = -this.ball.dy;
    }
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
  }
}

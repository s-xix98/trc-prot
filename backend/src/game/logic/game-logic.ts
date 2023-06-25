import { Socket } from 'socket.io';

import { Ball, Paddle } from '../types';
import { CreateBall, CreatePaddle } from '../game-constants';
import { GameDto } from '../dto/GameDto';

import { keyActions, Keys } from './KeyAction';

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
  private keyInputs: boolean[] = [];

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
      this.HandleKeyActions();
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

  HandleKeyPress(key: Keys) {
    console.log('handle press', key);
    this.keyInputs[key] = true;
  }

  HandleKeyRelease(key: Keys) {
    console.log('handle release', key);
    this.keyInputs[key] = false;
  }

  EndGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ボールの半径とパドルの厚みを考慮してないからめり込む
  private UpdateBallPosition() {
    let newX = this.ball.x + this.ball.dx;
    let newY = this.ball.y + this.ball.dy;

    const isLeftPaddleHitByBall = () => {
      return (
        newX <= 0 &&
        IsInRange(
          this.ball.y,
          this.leftPaddle.y,
          this.leftPaddle.y + this.leftPaddle.height,
        )
      );
    };

    const isRightPaddleHitByBall = () => {
      return (
        newX >= 1 &&
        IsInRange(
          this.ball.y,
          this.rightPaddle.y,
          this.rightPaddle.y + this.rightPaddle.height,
        )
      );
    };

    if (isLeftPaddleHitByBall()) {
      newX = -newX;
      this.ball.dx = -this.ball.dx;
    } else if (isRightPaddleHitByBall()) {
      newX = 1 - (newX - 1);
      this.ball.dx = -this.ball.dx;
    }

    if (newY <= 0) {
      newY = -newY;
      this.ball.dy = -this.ball.dy;
    } else if (newY >= 1) {
      newY = 1 - (newY - 1);
      this.ball.dy = -this.ball.dy;
    }

    this.ball.x = newX;
    this.ball.y = newY;
  }

  private HandleKeyActions() {
    // 一旦どっちも動かす
    if (this.keyInputs[Keys.Up]) {
      keyActions[Keys.Up](this.leftPaddle);
      keyActions[Keys.Up](this.rightPaddle);
    }
    if (this.keyInputs[Keys.Down]) {
      keyActions[Keys.Down](this.leftPaddle);
      keyActions[Keys.Down](this.rightPaddle);
    }
  }
}

import { Socket } from 'socket.io';

import { Ball, Paddle, Scores } from '../types';
import {
  canvas,
  CreateBall,
  CreateLeftPaddle,
  CreateRightPaddle,
} from '../game-constants';
import { GameDto } from '../dto/GameDto';

import { keyActions, Keys } from './KeyAction';

const IsInRange = (pos: number, start: number, end: number) => {
  return start < pos && pos < end;
};

const MatchPoint = 3; // TODO 可変すにするかも

export class GameLogic {
  private ball: Ball;
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;
  private scores: Scores;
  private p1: Socket;
  private p2: Socket;
  private intervalId: any;
  private keyInputs: boolean[] = [];
  private isP1Ready: boolean;
  private isP2Ready: boolean;
  private matchPoint = MatchPoint;

  constructor(p1: Socket, p2: Socket, ball: Ball = CreateBall()) {
    this.ball = ball;
    this.p1 = p1;
    this.p2 = p2;
    this.leftPaddle = CreateLeftPaddle();
    this.rightPaddle = CreateRightPaddle();
    this.scores = { left: 0, right: 0 };
  }

  ReadyGame(client: Socket) {
    if (this.isP1Ready && this.isP2Ready) {
      return;
    }
    if (client.id === this.p1.id) {
      this.isP1Ready = true;
    }
    if (client.id === this.p2.id) {
      this.isP2Ready = true;
    }
    if (this.isP1Ready && this.isP2Ready) {
      this.StartGame();
    }
  }

  private StartGame() {
    console.log('start game loop');
    this.intervalId = setInterval(() => {
      if (!IsInRange(this.ball.x, canvas.xMin, canvas.xMax)) {
        this.UpdateScore();
        if (this.isGameOver()) {
          this.HandleGameOver();
        } else {
          this.Restart();
        }
        return;
      }
      this.HandleKeyActions();
      this.UpdateBallPosition();
      const gameDto: GameDto = {
        ball: this.ball,
        leftPaddle: this.leftPaddle,
        rightPaddle: this.rightPaddle,
        scores: this.scores,
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
        newX <= canvas.xMin &&
        IsInRange(
          this.ball.y,
          this.leftPaddle.y,
          this.leftPaddle.y + this.leftPaddle.height,
        )
      );
    };

    const isRightPaddleHitByBall = () => {
      return (
        newX >= canvas.xMax &&
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
      newX = canvas.xMax - (newX - canvas.xMax);
      this.ball.dx = -this.ball.dx;
    }

    if (newY <= canvas.yMin) {
      newY = -newY;
      this.ball.dy = -this.ball.dy;
    } else if (newY >= canvas.yMax) {
      newY = canvas.yMax - (newY - canvas.yMax);
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

  private isGameOver(): boolean {
    return (
      this.scores.left == this.matchPoint ||
      this.scores.right == this.matchPoint
    );
  }

  private HandleGameOver() {
    if (!this.isGameOver()) {
      return;
    }
    let winner: Socket | undefined;
    let loser: Socket | undefined;

    if (this.scores.left == this.matchPoint) {
      winner = this.p1;
    } else {
      loser = this.p1;
    }
    this.EndGame();
    this.ball = CreateBall();
    this.leftPaddle = CreateLeftPaddle();
    this.rightPaddle = CreateRightPaddle();
    winner?.emit('game win', {
      ball: this.ball,
      leftPaddle: this.leftPaddle,
      rightPaddle: this.rightPaddle,
      scores: this.scores,
    });
    loser?.emit('game lose', {
      ball: this.ball,
      leftPaddle: this.leftPaddle,
      rightPaddle: this.rightPaddle,
      scores: this.scores,
    });
    this.scores = { left: 0, right: 0 };
  }

  private Restart() {
    this.EndGame();
    this.ball = CreateBall();
    this.leftPaddle = CreateLeftPaddle();
    this.rightPaddle = CreateRightPaddle();
    this.p1.emit('game data', {
      ball: this.ball,
      leftPaddle: this.leftPaddle,
      rightPaddle: this.rightPaddle,
      scores: this.scores,
    });
    setTimeout(this.StartGame.bind(this), 500);
  }

  private UpdateScore() {
    if (this.ball.x <= 0) {
      this.scores.right++;
    } else if (this.ball.x >= 1) {
      this.scores.left++;
    }
  }
}

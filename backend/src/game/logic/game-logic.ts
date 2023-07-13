import { Socket } from 'socket.io';

import { Ball, OnShutdownCallback, Paddle } from '../types';
import {
  canvas,
  CreateBall,
  CreateLeftPaddle,
  CreateRightPaddle,
} from '../game-constants';
import { GameDto } from '../dto/GameDto';

import { keyActions, Keys } from './KeyAction';

type Player = {
  socket: Socket;
  isReady: boolean;
  paddle: Paddle;
  keyInputs: boolean[];
  score: number;
};

const MatchPoint = 3; // TODO 可変すにするかも

const IsInRange = (pos: number, start: number, end: number) => {
  return start < pos && pos < end;
};

export class GameLogic {
  private ball: Ball;
  private p1: Player;
  private p2: Player;
  private intervalId: any;
  private matchPoint = MatchPoint;
  private onShutdown: OnShutdownCallback;

  constructor(
    sock1: Socket,
    sock2: Socket,
    onShutdown: OnShutdownCallback,
    ball: Ball = CreateBall(),
  ) {
    this.ball = ball;
    this.p1 = {
      socket: sock1,
      isReady: false,
      paddle: CreateLeftPaddle(),
      keyInputs: [],
      score: 0,
    };
    this.p2 = {
      socket: sock2,
      isReady: false,
      paddle: CreateRightPaddle(),
      keyInputs: [],
      score: 0,
    };
    this.onShutdown = onShutdown;
  }

  ReadyGame(client: Socket) {
    if (this.p1.isReady && this.p2.isReady) {
      return;
    }
    if (client.id === this.p1.socket.id) {
      this.p1.isReady = true;
    }
    if (client.id === this.p2.socket.id) {
      this.p2.isReady = true;
    }
    if (this.p1.isReady && this.p2.isReady) {
      this.p1.socket.emit('game ready left', this.ConvertToGameDto());
      this.p2.socket.emit('game ready right', this.ConvertToGameDto());
      setTimeout(this.StartGame.bind(this), 5000);
    }
  }

  private StartGame() {
    console.log('start game loop');
    this.intervalId = setInterval(() => {
      if (!IsInRange(this.ball.x, canvas.xMin, canvas.xMax)) {
        this.UpdateScore();
        if (this.isGameFinished()) {
          this.HandleGameOver();
        } else {
          this.Restart();
        }
        return;
      }
      this.HandleKeyActions();
      this.UpdateBallPosition();
      this.p1.socket.emit('game data', this.ConvertToGameDto());
      this.p2.socket.emit('game data', this.ConvertToGameDto());
    }, 10);
  }

  HandleKeyPress(client: Socket, key: Keys) {
    console.log('handle press', key);
    if (client.id === this.p1.socket.id) {
      this.p1.keyInputs[key] = true;
    }
    if (client.id === this.p2.socket.id) {
      this.p2.keyInputs[key] = true;
    }
  }

  HandleKeyRelease(client: Socket, key: Keys) {
    console.log('handle release', key);
    if (client.id === this.p1.socket.id) {
      this.p1.keyInputs[key] = false;
    }
    if (client.id === this.p2.socket.id) {
      this.p2.keyInputs[key] = false;
    }
  }

  EndGame() {
    if (!this.intervalId) {
      return;
    }
    clearInterval(this.intervalId);
    let winner: Socket;
    let loser: Socket;

    if (this.p1.score == this.matchPoint) {
      winner = this.p1.socket;
      loser = this.p2.socket;
    } else {
      winner = this.p2.socket;
      loser = this.p1.socket;
    }
    this.onShutdown(winner, loser, {
      left: this.p1.score,
      right: this.p2.score,
    });
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
          this.p1.paddle.y,
          this.p1.paddle.y + this.p1.paddle.height,
        )
      );
    };

    const isRightPaddleHitByBall = () => {
      return (
        newX >= canvas.xMax &&
        IsInRange(
          this.ball.y,
          this.p2.paddle.y,
          this.p2.paddle.y + this.p2.paddle.height,
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
    if (this.p1.keyInputs[Keys.Up]) {
      keyActions[Keys.Up](this.p1.paddle);
    }
    if (this.p1.keyInputs[Keys.Down]) {
      keyActions[Keys.Down](this.p1.paddle);
    }
    if (this.p2.keyInputs[Keys.Up]) {
      keyActions[Keys.Up](this.p2.paddle);
    }
    if (this.p2.keyInputs[Keys.Down]) {
      keyActions[Keys.Down](this.p2.paddle);
    }
  }

  private isGameFinished(): boolean {
    return this.p1.score == this.matchPoint || this.p2.score == this.matchPoint;
  }

  private HandleGameOver() {
    if (!this.isGameFinished()) {
      return;
    }
    this.EndGame();
    this.ball = CreateBall();
    this.p1.paddle = CreateLeftPaddle();
    this.p2.paddle = CreateRightPaddle();

    let winner: Socket;
    let loser: Socket;

    if (this.p1.score == this.matchPoint) {
      winner = this.p1.socket;
      loser = this.p2.socket;
    } else {
      winner = this.p2.socket;
      loser = this.p1.socket;
    }
    winner.emit('game win', this.ConvertToGameDto());
    loser.emit('game lose', this.ConvertToGameDto());
  }

  private Restart() {
    this.EndGame();
    this.ball = CreateBall();
    this.p1.paddle = CreateLeftPaddle();
    this.p2.paddle = CreateRightPaddle();
    this.p1.socket.emit('game data', this.ConvertToGameDto());
    this.p2.socket.emit('game data', this.ConvertToGameDto());
    setTimeout(this.StartGame.bind(this), 500);
  }

  private UpdateScore() {
    if (this.ball.x <= 0) {
      this.p2.score++;
    } else if (this.ball.x >= 1) {
      this.p1.score++;
    }
  }

  private ConvertToGameDto(): GameDto {
    return {
      ball: this.ball,
      leftPaddle: this.p1.paddle,
      rightPaddle: this.p2.paddle,
      scores: { left: this.p1.score, right: this.p2.score },
    };
  }
}

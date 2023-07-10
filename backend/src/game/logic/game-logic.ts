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

type Player = {
  socket: Socket;
  isReady: boolean;
  paddle: Paddle;
  keyInputs: boolean[];
  score: number;
};

export class GameLogic {
  private ball: Ball;
  private p1: Player;
  private p2: Player;
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;
  private scores: Scores;
  private intervalId: any;
  private p1KeyInputs: boolean[] = [];
  private p2KeyInputs: boolean[] = [];
  private matchPoint = MatchPoint;

  constructor(sock1: Socket, sock2: Socket, ball: Ball = CreateBall()) {
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
    this.leftPaddle = CreateLeftPaddle();
    this.rightPaddle = CreateRightPaddle();
    this.scores = { left: 0, right: 0 };
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
      this.p1.socket.emit('game data', gameDto);
      this.p2.socket.emit('game data', gameDto);
    }, 10);
  }

  HandleKeyPress(client: Socket, key: Keys) {
    console.log('handle press', key);
    if (client.id === this.p1.socket.id) {
      this.p1KeyInputs[key] = true;
    }
    if (client.id === this.p2.socket.id) {
      this.p2KeyInputs[key] = true;
    }
  }

  HandleKeyRelease(client: Socket, key: Keys) {
    console.log('handle release', key);
    if (client.id === this.p1.socket.id) {
      this.p1KeyInputs[key] = false;
    }
    if (client.id === this.p2.socket.id) {
      this.p2KeyInputs[key] = false;
    }
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
    if (this.p1KeyInputs[Keys.Up]) {
      keyActions[Keys.Up](this.leftPaddle);
    }
    if (this.p1KeyInputs[Keys.Down]) {
      keyActions[Keys.Down](this.leftPaddle);
    }
    if (this.p2KeyInputs[Keys.Up]) {
      keyActions[Keys.Up](this.rightPaddle);
    }
    if (this.p2KeyInputs[Keys.Down]) {
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
    let winner: Socket;
    let loser: Socket;

    if (this.scores.left == this.matchPoint) {
      winner = this.p1.socket;
      loser = this.p2.socket;
    } else {
      winner = this.p2.socket;
      loser = this.p1.socket;
    }
    this.EndGame();
    this.ball = CreateBall();
    this.leftPaddle = CreateLeftPaddle();
    this.rightPaddle = CreateRightPaddle();
    winner.emit('game win', {
      ball: this.ball,
      leftPaddle: this.leftPaddle,
      rightPaddle: this.rightPaddle,
      scores: this.scores,
    });
    loser.emit('game lose', {
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
    this.p1.socket.emit('game data', {
      ball: this.ball,
      leftPaddle: this.leftPaddle,
      rightPaddle: this.rightPaddle,
      scores: this.scores,
    });
    this.p2.socket.emit('game data', {
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

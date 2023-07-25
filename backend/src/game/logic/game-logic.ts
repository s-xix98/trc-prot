import { Socket } from 'socket.io';

import {
  Ball,
  OnShutdownCallback,
  Paddle,
  PlayerData,
  PlayerResult,
  ResultEvaluator,
} from '../types';
import {
  canvas,
  CreateBall,
  CreateLeftPaddle,
  CreateRightPaddle,
} from '../game-constants';
import { GameDto } from '../dto/GameDto';

import { keyActions, Keys } from './KeyAction';

type Player = {
  readonly userId: string;
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

const getRandomInt = (max:number):number => {
  return Math.floor(Math.random() * max);
}

export interface GameRule {
  EvaluateGameResult(
    p1: PlayerResult,
    p2: PlayerResult,
  ): { winner: PlayerResult; loser: PlayerResult } | null;
  CreateResultEvaluator(): ResultEvaluator;
  isGameFinished(p1Score: number, p2Score: number): boolean;
}

export class BasicRule implements GameRule {
  constructor(private readonly matchPoint = MatchPoint) {}

  EvaluateGameResult(p1: PlayerResult, p2: PlayerResult) {
    return this.CreateResultEvaluator()(p1, p2);
  }

  CreateResultEvaluator(): ResultEvaluator {
    const matchPoint = this.matchPoint;
    return (p1: PlayerResult, p2: PlayerResult) => {
      if (p1.score == matchPoint && p2.score != matchPoint) {
        return { winner: p1, loser: p2 };
      } else if (p2.score == matchPoint && p1.score != matchPoint) {
        return { winner: p2, loser: p1 };
      } else {
        return null;
      }
    };
  }

  isGameFinished(p1Score: number, p2Score: number): boolean {
    return p1Score == this.matchPoint || p2Score == this.matchPoint;
  }
}

export class GameLogic {
  private p1: Player;
  private p2: Player;
  private ball: Ball;
  private intervalId: any;

  constructor(
    p1: PlayerData,
    p2: PlayerData,
    private readonly onShutdown: OnShutdownCallback,
    private readonly rule: GameRule = new BasicRule(MatchPoint),
  ) {
    this.ball = this.CreateRandomBall();
    this.p1 = {
      socket: p1.client,
      userId: p1.data.id,
      isReady: false,
      paddle: CreateLeftPaddle(),
      keyInputs: [],
      score: 0,
    };
    this.p2 = {
      socket: p2.client,
      userId: p2.data.id,
      isReady: false,
      paddle: CreateRightPaddle(),
      keyInputs: [],
      score: 0,
    };
  }

  RebindSocket(userId: string, socket: Socket) {
    if (userId == this.p1.userId) {
      this.p1.socket = socket;
    } else if (userId == this.p2.userId) {
      this.p2.socket = socket;
    }
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
      setTimeout(this.StartGame.bind(this), 2000);
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
    if (!this.isGameFinished()) {
      return;
    }
    const p1Result: PlayerResult = this.p1;
    const p2Result: PlayerResult = this.p2;
    this.onShutdown(p1Result, p2Result, this.rule.CreateResultEvaluator());
  }

  private CreateRandomBall(): Ball {
    const ball = CreateBall();
    const random_angle =
      Math.random() * ((Math.PI * 5) / 6) - (Math.PI * 5) / 12;
    const p1_side = random_angle + Math.PI;
    const p2_side = random_angle;
    ball.angle = [p1_side, p2_side][getRandomInt(2)];
    return ball;
  }

  private getDxDy(speed: number, angle: number) {
    return { dx: speed * Math.cos(angle), dy: speed * Math.sin(angle) };
  }

  // ボールの半径とパドルの厚みを考慮してないからめり込む
  private UpdateBallPosition() {
    const { dx, dy } = this.getDxDy(this.ball.speed, this.ball.angle);
    let newX = this.ball.x + dx;
    let newY = this.ball.y + dy;

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
      this.ball.angle = this.ball.angle * -1 + Math.PI;
      this.ball.speed *= 1.05;
    } else if (isRightPaddleHitByBall()) {
      newX = canvas.xMax - (newX - canvas.xMax);
      this.ball.angle = this.ball.angle * -1 + Math.PI;
      this.ball.speed *= 1.05;
    }

    if (newY <= canvas.yMin) {
      newY = -newY;
      this.ball.angle *= -1;
    } else if (newY >= canvas.yMax) {
      newY = canvas.yMax - (newY - canvas.yMax);
      this.ball.angle *= -1;
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
    return this.rule.isGameFinished(this.p1.score, this.p2.score);
  }

  private HandleGameOver() {
    if (!this.isGameFinished()) {
      return;
    }
    this.EndGame();
    this.ball = this.CreateRandomBall();
    this.p1.paddle = CreateLeftPaddle();
    this.p2.paddle = CreateRightPaddle();

    const players = this.GetWinnerLoserPair();
    players?.winner.socket.emit('game win', this.ConvertToGameDto());
    players?.loser.socket.emit('game lose', this.ConvertToGameDto());
  }

  private Restart() {
    this.EndGame();
    this.ball = this.CreateRandomBall();
    this.p1.paddle = CreateLeftPaddle();
    this.p2.paddle = CreateRightPaddle();
    this.p1.socket.emit('game data', this.ConvertToGameDto());
    this.p2.socket.emit('game data', this.ConvertToGameDto());
    setTimeout(this.StartGame.bind(this), 500);
  }

  private GetWinnerLoserPair() {
    const players = this.rule.EvaluateGameResult(this.p1, this.p2);
    if (!players) {
      return null;
    }
    if (this.p1.userId == players.winner.userId) {
      return { winner: this.p1, loser: this.p2 };
    } else {
      return { winner: this.p2, loser: this.p1 };
    }
  }

  private UpdateScore() {
    if (this.ball.x <= canvas.xMin) {
      this.p2.score++;
    } else if (this.ball.x >= canvas.xMax) {
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

import { Ball, Paddle } from './Types';

export const DrawBall = (ctx: CanvasRenderingContext2D, ball: Ball) => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
};

export const DrawPaddle = (ctx: CanvasRenderingContext2D, paddle: Paddle) => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
};

export const DrawScores = (
  ctx: CanvasRenderingContext2D,
  scores: { left: number; right: number },
  canvasWidth: number,
  canvasHeight: number,
) => {
  ctx.fillStyle = 'white';
  ctx.font = '48px serif'; // TODO ピクセル数動的に変わるべきかも
  const leftWidth = ctx.measureText(`${scores.left}`).width;
  const rightWidth = ctx.measureText(`${scores.right}`).width;
  ctx.fillText(
    `${scores.left}`,
    canvasWidth / 4 - leftWidth / 2,
    canvasHeight / 4,
  );
  ctx.fillText(
    `${scores.right}`,
    (canvasWidth * 3) / 4 - rightWidth / 2,
    canvasHeight / 4,
  );
};

export const DrawResult = (
  ctx: CanvasRenderingContext2D,
  result: 'WIN' | 'LOSE',
  canvasWidth: number,
  canvasHeight: number,
) => {
  ctx.fillStyle = 'white';
  ctx.font = '48px serif'; // TODO ピクセル数動的に変わるべきかも
  const mesure = ctx.measureText(result);
  const width = mesure.width;
  const height =
    mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent;
  ctx.fillText(
    result,
    (canvasWidth - width) / 2,
    canvasHeight / 2 + height / 2,
  );
};

export const DrawPlayerSide = (
  ctx: CanvasRenderingContext2D,
  side: 'LEFT' | 'RIGHT',
  canvasWidth: number,
  canvasHeight: number,
) => {
  ctx.fillStyle = 'white';
  ctx.font = '30px serif'; // TODO ピクセル数動的に変わるべきかも
  const mesure = ctx.measureText('YOU →');
  const width = mesure.width;
  const height =
    mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent;
  if (side == 'LEFT') {
    ctx.fillText(
      '← YOU',
      canvasWidth / 4 - width / 2,
      canvasHeight / 2 + height / 2,
    );
  } else {
    ctx.fillText(
      'YOU →',
      (canvasWidth * 3) / 4 - width / 2,
      canvasHeight / 2 + height / 2,
    );
  }
};

export const DrawCenterLine = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
) => {
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = canvasWidth / 100;
  ctx.setLineDash([canvasHeight / 10, canvasHeight / 20]);
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.stroke();
};

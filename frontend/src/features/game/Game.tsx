'use client';
import { useEffect } from 'react';

const Game = () => {
  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.style.border = '4px solid';
    canvas.style.color = 'black';
  }, []);

  return <canvas width={400} height={400} id={'canvas'}></canvas>;
};

export default Game;

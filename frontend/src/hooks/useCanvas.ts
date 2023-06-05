import { useEffect, useState } from 'react';

export const useCanvas = (canvasId: string) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const cnvs = document.getElementById(canvasId) as HTMLCanvasElement;
    setCanvas(cnvs);
    if (cnvs) {
      const canvasContext = cnvs.getContext('2d');
      setContext(canvasContext);
    }
  }, [canvasId]);
  return { canvas, ctx };
};

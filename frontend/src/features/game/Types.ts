export type Ball = {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
};

export type Paddle = {
  readonly x: number;
  y: number;
  width: number;
  height: number;
  readonly speed: number;
};

export class KeyAction {
  private isPressed;
  private action;

  constructor(act: () => void) {
    this.action = act;
    this.isPressed = false;
  }

  SetOn(): void {
    this.isPressed = true;
  }

  SetOff(): void {
    this.isPressed = false;
  }

  Run(): void {
    if (!this.isPressed) {
      return;
    }
    this.action();
  }
}

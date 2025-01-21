const MOVE_Y_PROBABILITY = 0.4;
// const MOVE_Y_PROBABILITY = 0.2;
const Y_MOVE_SCALE = 0.5;
// const Y_MOVE_SCALE = 25;

type IBox = {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export class Box implements MovableObject {
  public x
  public y
  public width
  public height
  public speed
  constructor(params: IBox) {
    this.width = params.width
    this.height = params.height
    this.x = params.x
    this.y = params.y
    this.speed = params.speed
  }

  moveOnIdle(deltaTime: number) {
    this.x += this.speed * deltaTime
    this.y +=
      Math.random() < MOVE_Y_PROBABILITY
        ? Math.sin(this.speed) * Y_MOVE_SCALE * deltaTime
        : 0;
  }

  isOutOfDisplay() {
    const OVER_LEFT_LIMIT = this.x > 1
    const OVER_BOTTOM_LIMIT = this.y < 0
    const OVER_TOP_LIMIT = this.y > 1
    return OVER_LEFT_LIMIT || OVER_BOTTOM_LIMIT || OVER_TOP_LIMIT
  }
}

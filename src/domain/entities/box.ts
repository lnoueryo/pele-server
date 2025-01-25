const MOVE_Y_PROBABILITY = 0.1
const Y_MOVE_SCALE = 0.15
const START_POSITION = 0.75
const SPEED_SALT = 25
const MIN_SPEED = 0.3
const MAX_SPEED = 0.6

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
  private ySalt = Math.random() - 0.5
  constructor(params: IBox) {
    this.width = params.width
    this.height = params.height
    this.x = params.x
    this.y = params.y
    this.speed = params.speed
  }

  moveOnIdle() {
    this.x -= this.speed
    this.y +=
      Math.random() < MOVE_Y_PROBABILITY
        ? (this.ySalt * this.speed) / Y_MOVE_SCALE
        : 0
  }

  isOutOfDisplay() {
    const OVER_LEFT_LIMIT = this.x - this.width > 1
    const OVER_BOTTOM_LIMIT = this.y + this.height < 0
    const OVER_TOP_LIMIT = this.y - this.height > 1
    return OVER_LEFT_LIMIT || OVER_BOTTOM_LIMIT || OVER_TOP_LIMIT
  }
  static createBox() {
    const x = 1
    const y = 1 * START_POSITION
    const width = Math.random() * 0.25
    const height = Math.random() * 0.1
    const randomSpeed = Math.random()
    const speed =
      randomSpeed < MIN_SPEED
        ? MIN_SPEED / SPEED_SALT
        : MAX_SPEED < randomSpeed
          ? MAX_SPEED / SPEED_SALT
          : randomSpeed / SPEED_SALT
    return new Box({
      width,
      height,
      x,
      y,
      speed,
    })
  }
}

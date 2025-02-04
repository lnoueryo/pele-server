import { IServerGameObject } from './interfaces/game-object.interface'
import config from '../../config'
export type BoxSetting = {
  moveYProbability: number
  yMoveScale: number
  startPosition: number
  speedSalt: number
  minSpeed: number
  maxSpeed: number
}
const {
  moveYProbability: MOVE_Y_PROBABILITY,
  yMoveScale: Y_MOVE_SCALE,
  startPosition: START_POSITION,
  speedSalt: SPEED_SALT,
  minSpeed: MIN_SPEED,
  maxSpeed: MAX_SPEED,
} = config.boxSetting

type IBox = {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export class Box implements IServerGameObject {
  public x
  public y
  public width
  public height
  public speed
  private ySalt = Math.random() - 0.5
  constructor(params: IBox) {
    this.x = params.x
    this.y = params.y
    this.width = params.width
    this.height = params.height
    this.speed = params.speed
  }

  moveOnIdle(deltaTime: number) {
    this.x -= this.speed * deltaTime
    this.y +=
      Math.random() < MOVE_Y_PROBABILITY
        ? (this.ySalt * this.speed * deltaTime) / Y_MOVE_SCALE
        : 0
  }

  isOutOfDisplay() {
    const OVER_LEFT_LIMIT = this.x + this.width < 0
    const OVER_BOTTOM_LIMIT = this.y + this.height < 0
    const OVER_TOP_LIMIT = this.y - this.height > 1
    return OVER_LEFT_LIMIT || OVER_BOTTOM_LIMIT || OVER_TOP_LIMIT
  }

  convertToJson(): { width: number; height: number; x: number; y: number; speed: number; } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      speed: this.speed,
    }
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

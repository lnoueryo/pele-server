const WIDTH = 40
const HEIGHT = 40
const FIRST_SPEED = 8

export class Player implements MovableObject {
  public id
  public x
  public y
  public width
  public height
  public speed
  public isOver
  constructor(params: {
    id: string
    x: number
    y: number
    width: number
    height: number
    speed: number
    isOver: boolean
  }) {
    this.id = params.id
    this.x = params.x
    this.y = params.y
    this.width = params.width
    this.height = params.height
    this.speed = params.speed
    this.isOver = params.isOver
  }

  convertToJson() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      speed: this.speed,
      isOver: this.isOver,
    }
  }

  updateFromJson(params: {
    x: number
    y: number
    width: number
    height: number
    isOver: number
  }) {
    this.x = params.x
    this.y = params.y
    this.width = params.width
    this.height = params.height
    this.isOver = params.isOver
    return new Player({
      id: this.id,
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
      speed: this.speed,
      isOver: this.isOver,
    })
  }

  static createPlayer = (id: string, { x, y }: { x: number, y: number}) => {
    return new Player({
      id,
      x,
      y,
      width: WIDTH,
      height: HEIGHT,
      speed: FIRST_SPEED,
      isOver: false,
    })
  }
}

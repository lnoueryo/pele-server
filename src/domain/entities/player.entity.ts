import config from '../../config'
import { MovableObject } from './interfaces/movable-object.interface'
export class Player implements MovableObject {
  public id
  public x
  public y
  public width
  public height
  public speed
  private vg: number
  private jumpStrength: number
  private color: string
  public isOver
  constructor(params: {
    id: string
    x: number
    y: number
    width: number
    height: number
    speed: number
    vg: number
    jumpStrength: number
    color: string
    isOver: boolean
  }) {
    this.id = params.id
    this.x = params.x
    this.y = params.y
    this.width = params.width
    this.height = params.height
    this.speed = params.speed
    this.vg = params.vg
    this.jumpStrength = params.jumpStrength
    this.color = params.color
    this.isOver = params.isOver
  }

  convertToJson(): {
    id: string
    x: number
    y: number
    width: number
    height: number
    vg: number
    speed: number
    jumpStrength: number
    color: string
    isOver: boolean
  } {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      vg: this.vg,
      speed: this.speed,
      jumpStrength: this.jumpStrength,
      color: this.color,
      isOver: this.isOver,
    }
  }

  updateFromJson(params: {
    x: number
    y: number
    width: number
    height: number
    isOver: boolean
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
      vg: this.vg,
      jumpStrength: this.jumpStrength,
      color: this.color,
      isOver: this.isOver,
    })
  }

  static createPlayer = (id: string) => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return new Player({
      id,
      ...config.playerSetting,
      color: `rgb(${r},${g},${b})`,
      isOver: false,
    })
  }
}

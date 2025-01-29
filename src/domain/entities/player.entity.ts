import { MovableObject } from './interfaces/movable-object.interface'
import { PlayerSetting } from './interfaces/player-setting.interface'
export class Player implements MovableObject {
  public id
  public name
  public clientId
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
    name: string
    clientId: string
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
    this.name = params.name
    this.clientId = params.clientId
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
    clientId: string
    name: string
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
      clientId: this.clientId,
      name: this.name,
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
      name: this.name,
      clientId: this.clientId,
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

  reset(playerSetting: PlayerSetting) {
    this.x = playerSetting.x
    this.y = playerSetting.y
    this.width = playerSetting.width
    this.height = playerSetting.height
    this.vg = playerSetting.vg
    this.speed = playerSetting.speed
    this.jumpStrength = playerSetting.jumpStrength
    this.isOver = false
  }

  static createPlayer = (
    id: string,
    name: string,
    clientId: string,
    playerSetting: PlayerSetting,
  ) => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return new Player({
      id,
      name,
      clientId,
      ...playerSetting,
      color: `rgb(${r},${g},${b})`,
      isOver: false,
    })
  }
}

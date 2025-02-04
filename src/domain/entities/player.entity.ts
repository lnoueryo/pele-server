import { IClientGameObject } from './interfaces/game-object.interface'
import { IPlayer, PlayerSetting } from './interfaces/player-setting.interface'
const CONNECTION_LIMIT_TIME = 8000
export class Player implements IClientGameObject, IPlayer {
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
  public timestamp: number
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
    timestamp: number
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
    this.timestamp = params.timestamp || 0
  }

  convertToJson(): {
    id: string
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
    timestamp: number
  } {
    return {
      id: this.id,
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
      timestamp: this.timestamp,
    }
  }

  updateFromJson(params: {
    x: number
    y: number
    width: number
    height: number
    isOver: boolean
  }): void {
    if (this.isOver) {
      return
    }
    this.x = params.x
    this.y = params.y
    this.width = params.width
    this.height = params.height
    this.isOver = params.isOver
    this.timestamp = Date.now()
  }

  isOutOfGame(currentTimestamp: number) {
    return currentTimestamp - this.timestamp >= CONNECTION_LIMIT_TIME
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
    this.timestamp = 0
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
      timestamp: 0,
    })
  }
}

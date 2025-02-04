import { IGameObject } from './game-object.interface'

export type PlayerSetting = {
  x: number
  y: number
  width: number
  height: number
  vg: number
  speed: number
  jumpStrength: number
}

export interface IPlayer extends IGameObject {
  id: string
  isOver: boolean
  timestamp: number
  reset(playerSetting: PlayerSetting): void
  convertToJson(): {
    id: string
    name: string
    width: number
    height: number
    x: number
    y: number
    vg: number
    jumpStrength: number
    speed: number
    color: string
    isOver: boolean
    timestamp: number
  }
}

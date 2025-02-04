export interface IGameObject {
  width: number
  height: number
  x: number
  y: number
  speed: number
  convertToJson(): {
    width: number
    height: number
    x: number
    y: number
    speed: number
  }
}

export interface IServerGameObject extends IGameObject {
  moveOnIdle(deltaTime: number): void
}

export interface IClientGameObject extends IGameObject {
  updateFromJson(params: {
    x: number
    y: number
    width: number
    height: number
    isOver: boolean
  }): void
}

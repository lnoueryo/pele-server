import { v4 as uuidv4 } from 'uuid'

export class GameResult {
  public id: string
  public gameId: string
  public userId: string
  public name: string
  public startTimestamp: number
  public lastTimestamp: number
  public createdAt: Date
  public updatedAt: Date
  constructor(params: {
    id?: string
    gameId: string
    userId: string
    name: string
    startTimestamp: number
    lastTimestamp: number
    createdAt: Date
    updatedAt: Date
  }) {
    this.id = params.id || uuidv4()
    this.gameId = params.gameId
    this.userId = params.userId
    this.name = params.name
    this.startTimestamp = params.startTimestamp
    this.lastTimestamp = params.lastTimestamp
    this.createdAt = params.createdAt
    this.updatedAt = params.updatedAt
  }
}

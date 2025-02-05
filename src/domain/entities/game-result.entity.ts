import { v4 as uuidv4 } from 'uuid'

export class GameResult {
  public id: string
  public gameId: string
  public userId: string
  public startTimestamp: Date
  public lastTimestamp: Date
  public createdAt: Date
  public updatedAt: Date
  constructor(params: {
    id?: string
    gameId: string
    userId: string
    startTimestamp: Date
    lastTimestamp: Date
    createdAt: Date
    updatedAt: Date
  }) {
    this.id = params.id || uuidv4()
    this.gameId = params.gameId
    this.userId = params.userId
    this.startTimestamp = params.startTimestamp
    this.lastTimestamp = params.lastTimestamp
    this.createdAt = params.createdAt
    this.updatedAt = params.updatedAt
  }
}
import { ApiProperty } from '@nestjs/swagger'

class GameResult {
  @ApiProperty()
  id: string

  @ApiProperty()
  gameId: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  name: string

  @ApiProperty()
  startTimestamp: number

  @ApiProperty()
  lastTimestamp: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  constructor(params: {
    id: string
    gameId: string
    userId: string
    name: string
    startTimestamp: number
    lastTimestamp: number
    createdAt: Date
    updatedAt: Date
  }) {
    this.id = params.id
    this.gameId = params.gameId
    this.userId = params.userId
    this.name = params.name
    this.startTimestamp = params.startTimestamp
    this.lastTimestamp = params.lastTimestamp
    this.createdAt = params.createdAt
    this.updatedAt = params.updatedAt
  }
}

export class GetGameResultResponse {
  @ApiProperty()
  public readonly gameResults: GameResult[]
  constructor(params: { gameResults: GameResult[] }) {
    this.gameResults = params.gameResults.map(
      (gameResult) => new GameResult(gameResult),
    )
  }
}

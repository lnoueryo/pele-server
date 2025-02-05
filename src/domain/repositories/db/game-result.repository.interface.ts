import { GameResult } from 'src/domain/entities/game-result.entity'
export const IGameResultRepository = Symbol('IGameResultRepository')
export type IGameResultRepository = {
  findAll(): Promise<GameResult[]>
  findByUserId(id: string): Promise<GameResult[]>
  save(gameResult: GameResult): Promise<GameResult>
}

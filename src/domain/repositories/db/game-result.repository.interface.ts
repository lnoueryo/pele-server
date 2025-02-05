import { GameResult } from "src/domain/entities/game-result.entity"
export const IGameResultRepository = Symbol('IGameResultRepository')
export type IGameResultRepository = {
  getByUserId(id: string): Promise<GameResult[]>
  save(gameResult: GameResult): Promise<GameResult>
}

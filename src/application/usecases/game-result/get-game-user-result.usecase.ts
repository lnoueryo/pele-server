import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { GameResult } from 'src/domain/entities/game-result.entity'
import { IGameResultRepository } from 'src/domain/repositories/db/game-result.repository.interface'

@Injectable()
export class GetGameUserResultUseCase {
  constructor(
    @Inject(forwardRef(() => IGameResultRepository))
    private readonly gameResultRepository: IGameResultRepository
  ) {}

  async do(userId: string): Promise<GameResult[]> {
    return await this.gameResultRepository.findByUserId(userId)
  }
}

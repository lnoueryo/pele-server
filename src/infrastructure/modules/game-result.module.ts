import { Module } from '@nestjs/common'
import { IGameResultRepository } from 'src/domain/repositories/db/game-result.repository.interface'
import { GameResultRepository } from '../db/firestore/game-result.repository'
import { fireStore } from '../plugins/firebase-admin'
import { GetGameResultUseCase } from 'src/application/usecases/game-result/get-game-result.usecase'
import { GetGameUserResultUseCase } from 'src/application/usecases/game-result/get-game-user-result.usecase'
import { GameResultController } from 'src/interfaces/controllers/http/game-result.controller'

@Module({
  controllers: [GameResultController],
  providers: [
    GetGameResultUseCase,
    GetGameUserResultUseCase,
    {
      provide: IGameResultRepository,
      useClass: GameResultRepository,
    },
    {
      provide: 'FIRESTORE',
      useValue: fireStore,
    },
  ],
  exports: [IGameResultRepository],
})
export class GameResultModule {}

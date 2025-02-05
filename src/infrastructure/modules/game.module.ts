import { CreatePlayerUsecase } from 'src/application/usecases/player/create-player.usecase'
import { GameController } from '../../interfaces/controllers/websocket/game.controller'
import { Module } from '@nestjs/common'
import { UpdatePlayerUsecase } from 'src/application/usecases/player/update-player.usecase'
import { Server } from 'socket.io'
import { PlayerRepository } from '../memory/player.repository'
import { StartGameUsecase } from 'src/application/usecases/player/start-game.usecase'
import { GameNotifier } from '../websocket/game.notifier'
import { WebsocketClientRepository } from '../memory/websocket-client.repository'
import { ConnectWebsocketUsecase } from 'src/application/usecases/player/connect-websocket.usecase'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { IGameResultRepository } from 'src/domain/repositories/db/game-result.repository.interface'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import { DisconnectWebsocketUsecase } from 'src/application/usecases/player/disconnect-websocket.usecase'
import { IGameNotifier } from 'src/domain/notifiers/game.notifier.interface'
import { GameStartService } from 'src/domain/services/game/game-start.service'
import { GameCreateParticipantService } from 'src/domain/services/game/game-create-participant'
import { GameResultRepository } from '../db/firestore/game-result.repository'
import { fireStore } from '../plugins/firebase-admin'

@Module({
  providers: [
    GameController,
    CreatePlayerUsecase,
    UpdatePlayerUsecase,
    StartGameUsecase,
    ConnectWebsocketUsecase,
    DisconnectWebsocketUsecase,
    GameCreateParticipantService,
    GameStartService,
    {
      provide: IPlayerRepository,
      useClass: PlayerRepository,
    },
    {
      provide: IGameNotifier,
      useClass: GameNotifier,
    },
    {
      provide: IWebsocketClientRepository,
      useClass: WebsocketClientRepository,
    },
    {
      provide: IGameResultRepository,
      useClass: GameResultRepository,
    },
    {
      provide: 'FIRESTORE',
      useValue: fireStore,
    },
    Server,
  ],
})
export class GameModule {}

import { CreatePlayerUsecase } from 'src/application/usecases/player/create-player.usecase'
import { GameController } from '../../interfaces/controllers/websocket/game.controller'
import { Module } from '@nestjs/common'
import { UpdatePlayerUsecase } from 'src/application/usecases/player/update-player.usecase'
import { Server } from 'socket.io'
import { PlayerRepository } from '../memory/player.repository'
import { StartGameUsecase } from 'src/application/usecases/player/start-game.usecase'
import { WebsocketGameRepository } from '../websocket/game.repository'
import { WebsocketClientRepository } from '../memory/websocket-client.repository'
import { ConnectWebsocketUsecase } from 'src/application/usecases/player/connect-websocket.usecase'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { IWebsocketGameRepository } from 'src/domain/repositories/websocket/game.repository'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import { DisconnectWebsocketUsecase } from 'src/application/usecases/player/disconnect-websocket.usecase'

@Module({
  providers: [
    GameController,
    CreatePlayerUsecase,
    UpdatePlayerUsecase,
    StartGameUsecase,
    ConnectWebsocketUsecase,
    DisconnectWebsocketUsecase,
    {
      provide: IPlayerRepository,
      useClass: PlayerRepository,
    },
    {
      provide: IWebsocketGameRepository,
      useClass: WebsocketGameRepository,
    },
    {
      provide: IWebsocketClientRepository,
      useClass: WebsocketClientRepository,
    },
    Server,
  ],
})
// websocketClientRepository
// websocketGameRepository
// playerRepository
// websocketGameRepository
export class GameModule {}

import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Player } from 'src/domain/entities/player.entity'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { UsecaseResult } from './shared/usecase-result'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'
import { IWebsocketGameRepository } from 'src/domain/repositories/websocket/game.repository'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'

@Injectable()
export class CreatePlayerUsecase {
  constructor(
    @Inject(forwardRef(() => IPlayerRepository))
    private playerRepository: IPlayerRepository,
    @Inject(forwardRef(() => IWebsocketGameRepository))
    private websocketGameRepository: IWebsocketGameRepository,
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
  ) {}
  execute(
    id: string,
    client: IWebsocketClient,
  ): UsecaseResult<
    {
      player: {
        x: number
        y: number
        width: number
        height: number
        isOver: boolean
      }
    },
    'internal'
  > {
    try {
      const player = this.playerRepository.findById(id)
      const newPlayer = player || Player.createPlayer(id)
      this.playerRepository.save(newPlayer)
      this.websocketGameRepository.createPlayer(newPlayer, {
        clients: [client],
      })
      const players = this.playerRepository.findAll()
      const clients = this.websocketClientRepository.findAll()
      this.websocketGameRepository.acceptPlayer(players, { clients })
      return {
        success: {
          player: newPlayer.convertToJson(),
        },
      }
    } catch (error) {
      Logger.error(error)
      return {
        error: {
          type: 'internal',
          message: 'Internal server error',
        },
      }
    }
  }
}

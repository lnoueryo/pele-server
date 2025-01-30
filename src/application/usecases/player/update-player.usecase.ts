import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { UsecaseResult } from './shared/usecase-result'
import { IGameNotifier } from 'src/domain/notifiers/game.notifier.interface'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'

@Injectable()
export class UpdatePlayerUsecase {
  constructor(
    @Inject(forwardRef(() => IPlayerRepository))
    private readonly playerRepository: IPlayerRepository,
    @Inject(forwardRef(() => IGameNotifier))
    private readonly gameNotifier: IGameNotifier,
  ) {}
  execute(
    body: {
      id: string
      x: number
      y: number
      width: number
      height: number
      isOver: boolean
    },
    client: IWebsocketClient,
  ): UsecaseResult<boolean, 'not-found' | 'internal'> {
    try {
      const player = this.playerRepository.findById(body.id)
      if (!player) {
        const message = `Player not found\nbody: ${body}`
        Logger.warn(message)
        return {
          error: {
            type: 'not-found',
            message,
          },
        }
      }
      player.updateFromJson(body)
      this.gameNotifier.updatePosition(player, {
        excludeClient: client,
      })
      return {
        success: true,
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

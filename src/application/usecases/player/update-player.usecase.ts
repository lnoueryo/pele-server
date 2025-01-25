import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { UsecaseResult } from './shared/usecase-result'
import { IWebsocketGameRepository } from 'src/domain/repositories/websocket/game.repository'
import { SocketIO } from 'src/infrastructure/plugins/socket.io'

@Injectable()
export class UpdatePlayerUsecase {
  constructor(
    @Inject(forwardRef(() => IPlayerRepository))
    private playerRepository: IPlayerRepository,
    @Inject(forwardRef(() => IWebsocketGameRepository))
    private readonly websocketGameRepository: IWebsocketGameRepository,
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
    client: SocketIO
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
      this.websocketGameRepository.updatePosition(player, { excludeClient: client })
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

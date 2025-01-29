import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Game } from 'src/domain/entities/game.entity'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { IWebsocketGameRepository } from 'src/domain/repositories/websocket/game.repository'
import { UsecaseResult } from './shared/usecase-result'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import config from '../../../config'

const MAX_ERROR_COUNT = 10

@Injectable()
export class StartGameUsecase {
  private isGameRunning = false
  constructor(
    @Inject(forwardRef(() => IPlayerRepository))
    private readonly playerRepository: IPlayerRepository,
    @Inject(forwardRef(() => IWebsocketGameRepository))
    private readonly websocketGameRepository: IWebsocketGameRepository,
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
  ) {}
  async execute(
  ): Promise<UsecaseResult<true, 'internal'>> {
    // TODO: サービスに切り出す　存在してないプレイヤーの処理
    const clients = this.websocketClientRepository.findAll()
    this.playerRepository.reset(config.playerSetting)
    const players = this.playerRepository.findAll()
    this.websocketGameRepository.startGame(players, { clients })
    if (this.isGameRunning) return { success: true }
    this.isGameRunning = true
    try {
      const players = this.playerRepository.findAll()
      const game = new Game({ players })
      let errorCount = 0
      let lastTimestamp = 0
      while (true) {
        try {
          const currentTimestamp = Date.now()
          const deltaTime = (currentTimestamp - lastTimestamp) / 1000
          lastTimestamp = currentTimestamp
          game.loop(deltaTime)
          const boxes = game.boxes.map((box) => {
            const buffer = new ArrayBuffer(20)
            const view = new DataView(buffer)
            view.setFloat32(0, box.x)
            view.setFloat32(4, box.y)
            view.setFloat32(8, box.width)
            view.setFloat32(12, box.height)
            view.setFloat32(16, box.speed)
            return buffer
          })
          const clients = this.websocketClientRepository.findAll()
          this.websocketGameRepository.updateStage(boxes, { clients })
          await new Promise((resolve) => setTimeout(resolve, 1000 / 80))
          if (game.isGameOver() || players.length === 0) {
            break
          }
        } catch (error) {
          Logger.warn(error)
          errorCount++
          if (errorCount === MAX_ERROR_COUNT) {
            throw error
          }
        }
      }
      Logger.log('Done')
    } catch (error) {
      Logger.error(error)
      return {
        error: {
          type: 'internal',
          message: 'Internal server error',
        },
      }
    } finally {
      this.isGameRunning = false
    }
    return { success: true }
  }
}

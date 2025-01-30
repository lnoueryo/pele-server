import { forwardRef, Inject, Logger } from '@nestjs/common'
import { Game } from 'src/domain/entities/game.entity'
import { IGameNotifier } from 'src/domain/notifiers/game.notifier.interface'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'

const MAX_ERROR_COUNT = 5
const FRAME_RATE = 60
const MILLISECONDS_PER_SECOND = 1000

export class GameStartService {
  constructor(
    @Inject(forwardRef(() => IGameNotifier))
    private gameNotifier: IGameNotifier,
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
  ) {}

  async run(game: Game): Promise<void> {
    let errorCount = 0
    let lastTimestamp = Date.now()

    while (true) {
      try {
        const currentTimestamp = Date.now()
        const deltaTime =
          (currentTimestamp - lastTimestamp) / MILLISECONDS_PER_SECOND
        lastTimestamp = currentTimestamp

        game.loop(deltaTime)

        const updatedStage = this.updateStage(game)
        const clients = this.websocketClientRepository.findAll()
        this.gameNotifier.updateStage(updatedStage, { clients })
        if (game.isGameOver() || game.isNoPlayer()) {
          break
        }
        await new Promise((resolve) =>
          setTimeout(resolve, MILLISECONDS_PER_SECOND / FRAME_RATE),
        )
      } catch (error) {
        Logger.warn(error)
        errorCount++
        if (errorCount === MAX_ERROR_COUNT) {
          throw error
        }
      }
    }
  }

  private updateStage(game: Game): { boxes: ArrayBuffer[] } {
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
    return { boxes }
  }
}

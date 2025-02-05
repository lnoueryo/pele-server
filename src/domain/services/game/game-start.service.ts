import { forwardRef, Inject, Logger } from '@nestjs/common'
import { Game } from 'src/domain/entities/game.entity'
import { Player } from 'src/domain/entities/player.entity'
import { IGameNotifier } from 'src/domain/notifiers/game.notifier.interface'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'

const MAX_ERROR_COUNT = 5
const FRAME_RATE = 60
const MILLISECONDS_PER_SECOND = 1000
const PLAYER_DELAY = 1000

export class GameStartService {
  constructor(
    @Inject(forwardRef(() => IGameNotifier))
    private gameNotifier: IGameNotifier,
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
  ) {}

  async run(game: Game): Promise<void> {
    let errorCount = 0
    game.startTimestamp = Date.now()
    while (true) {
      try {
        const currentTimestamp = Date.now()
        const deltaTime =
          (currentTimestamp - game.lastTimestamp) / MILLISECONDS_PER_SECOND
        game.updateCurrentTime(currentTimestamp)

        if (currentTimestamp - game.startTimestamp > PLAYER_DELAY) {
          game.processPlayers(deltaTime)
        }
        game.processBoxes(deltaTime)

        this.removeDisconnectedPlayers(game)
        const updatedStage = this.updateStage(game)
        const clients = this.websocketClientRepository.findAll()
        this.gameNotifier.updateStage(
          {
            ...updatedStage,
            currentTime: game.lastTimestamp - game.startTimestamp,
          },
          { clients },
        )
        game.computers.forEach((computer) => {
          this.gameNotifier.updatePosition(computer, { clients })
        })
        if (game.shouldTerminate()) {
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
      const { x, y, width, height, speed } = box.convertToJson()
      view.setFloat32(0, x)
      view.setFloat32(4, y)
      view.setFloat32(8, width)
      view.setFloat32(12, height)
      view.setFloat32(16, speed)
      return buffer
    })
    return { boxes }
  }

  private removeDisconnectedPlayers(game: Game) {
    game.players.forEach((player) => {
      if (
        player instanceof Player &&
        player.isOutOfGame(game.lastTimestamp) &&
        !player.isOver
      ) {
        player.y = 1
        player.isOver = true
        player.timestamp = Date.now()
        const clients = this.websocketClientRepository.findAll()
        this.gameNotifier.updatePosition(player, { clients })
      }
    })
  }

}

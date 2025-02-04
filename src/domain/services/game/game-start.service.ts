import { forwardRef, Inject, Logger } from '@nestjs/common'
import { Game } from 'src/domain/entities/game.entity'
import { Player } from 'src/domain/entities/player.entity'
import { IGameNotifier } from 'src/domain/notifiers/game.notifier.interface'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'

const MAX_ERROR_COUNT = 5
const FRAME_RATE = 60
const MILLISECONDS_PER_SECOND = 1000

export class GameStartService {
  private startTimestamp: number = Date.now()
  private currentTimestamp: number = Date.now()
  constructor(
    @Inject(forwardRef(() => IGameNotifier))
    private gameNotifier: IGameNotifier,
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
  ) {}

  async run(game: Game): Promise<void> {
    let errorCount = 0
    this.startTimestamp = Date.now()
    while (true) {
      try {
        this.currentTimestamp = game.loop(this.startTimestamp)
        this.removeDisconnectedPlayers(game)
        const updatedStage = this.updateStage(game)
        const clients = this.websocketClientRepository.findAll()
        this.gameNotifier.updateStage(
          {
            ...updatedStage,
            currentTime: this.currentTimestamp - this.startTimestamp,
          },
          { clients },
        )
        game.computers.forEach((computer) => {
          this.gameNotifier.updatePosition(computer, { clients })
        })
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
    this.sendEndGameNotification(game)
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
        player.isOutOfGame(this.currentTimestamp) &&
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

  private sendEndGameNotification(game: Game) {
    const clients = this.websocketClientRepository.findAll()
    this.gameNotifier.endGame(
      { ranking: game.outputGameResult(), startTimestamp: this.startTimestamp },
      { clients },
    )
  }
}

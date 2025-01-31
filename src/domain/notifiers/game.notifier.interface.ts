import { Player } from 'src/domain/entities/player.entity'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'

export type ClientOption =
  | { excludeClient: IWebsocketClient }
  | { clients: IWebsocketClient[] }

export const IGameNotifier = Symbol('IGameNotifier')
export type IGameNotifier = {
  acceptPlayer(players: Player[], options?: ClientOption): void
  updatePosition(player: Player, options?: ClientOption): void
  startGame(players: Player[], options?: ClientOption): void
  updateStage(
    stage: { boxes: ArrayBuffer[]; currentTime: number },
    options?: ClientOption,
  ): void
  endGame(
    endData: {
      ranking: { name: string; timestamp: number }[]
      startTimestamp: number
    },
    options?: ClientOption,
  )
}

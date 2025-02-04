import { Player } from 'src/domain/entities/player.entity'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'
import { IPlayer } from '../entities/interfaces/player-setting.interface'

export type ClientOption =
  | { excludeClient: IWebsocketClient }
  | { clients: IWebsocketClient[] }

export const IGameNotifier = Symbol('IGameNotifier')
export type IGameNotifier = {
  acceptPlayer(players: Player[], options?: ClientOption): void
  updatePosition(player: IPlayer, options?: ClientOption): void
  startGame(players: IPlayer[], options?: ClientOption): void
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

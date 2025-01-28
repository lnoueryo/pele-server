import { Player } from 'src/domain/entities/player.entity'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'

export type ClientOption =
  | { excludeClient: IWebsocketClient }
  | { clients: IWebsocketClient[] }

export const IWebsocketGameRepository = Symbol('IWebsocketGameRepository')
export type IWebsocketGameRepository = {
  acceptPlayer(players: Player[], options: ClientOption): void
  updatePosition(player: Player, options: ClientOption): void
  startGame(options?: ClientOption): void
  updateStage(boxes: ArrayBuffer[], options: ClientOption): void
  connectWebsocket(socketId: string, options: ClientOption): void
}

import { Player } from 'src/domain/entities/player.entity'
import {
  ClientOption,
  IWebsocketGameRepository,
} from 'src/domain/repositories/websocket/game.repository'
type PlayerData = {
  id: string
  x: number
  y: number
  width: number
  height: number
  vg: number
  speed: number
  jumpStrength: number
  color: string
  isOver: boolean
}
type GameEventMap = {
  start: undefined
  connected: string
  stage: {
    boxes: ArrayBuffer[]
  }
  join: PlayerData[]
  player: PlayerData
  position: {
    id: string
    x: number
    y: number
    width: number
    height: number
    isOver: boolean
  }
  error: {
    error: {
      type: 'internal' | 'not-found'
      message: string
    }
  }
}
export class WebsocketGameRepository implements IWebsocketGameRepository {
  constructor() {}
  acceptPlayer(players: Player[], options?: ClientOption) {
    console.log('players')
    console.log(players)
    this.send(
      'join',
      players.map((player) => player.convertToJson()),
      options,
    )
  }
  createPlayer(player: Player, options: ClientOption) {
    this.send('player', player.convertToJson(), options)
  }
  updatePosition(player: Player, options: ClientOption) {
    this.send('position', player.convertToJson(), options)
  }
  startGame(options?: ClientOption) {
    this.send('start', undefined, options)
  }
  updateStage(boxes: ArrayBuffer[], options: ClientOption) {
    this.send('stage', { boxes }, options)
  }
  connectWebsocket(socketId: string, options: ClientOption) {
    this.send('connected', socketId, options)
  }
  private send<K extends keyof GameEventMap>(
    event: K,
    payload: GameEventMap[K],
    options: ClientOption,
  ) {
    if ('clients' in options) {
      options.clients.forEach((client) => {
        client.emit(event, payload)
      })
    } else {
      options.excludeClient.broadcast(event, payload)
    }
  }
}

import { Player } from 'src/domain/entities/player.entity'
import {
  ClientOption,
  IGameNotifier,
} from 'src/domain/notifiers/game.notifier.interface'
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
  start: Player[]
  end: {
    ranking: { name: string; timestamp: number }[]
    startTimestamp: number
  }
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
export class GameNotifier implements IGameNotifier {
  constructor() {}
  acceptPlayer(players: Player[], options?: ClientOption) {
    this.send(
      'join',
      players.map((player) => player.convertToJson()),
      options,
    )
  }
  updatePosition(player: Player, options?: ClientOption) {
    this.send('position', player.convertToJson(), options)
  }
  startGame(players: Player[], options?: ClientOption) {
    this.send('start', players, options)
  }
  updateStage(
    stage: {
      boxes: ArrayBuffer[]
      currentTimestamp: number
    },
    options?: ClientOption,
  ) {
    this.send('stage', stage, options)
  }
  endGame(
    endData: {
      ranking: { name: string; timestamp: number }[]
      startTimestamp: number
    },
    options?: ClientOption,
  ) {
    this.send('end', endData, options)
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

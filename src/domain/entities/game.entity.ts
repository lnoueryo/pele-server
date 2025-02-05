import { Box } from './box.entity'
import { ComputerPlayer } from './computer.entiry'
import { IPlayer, PlayerSetting } from './interfaces/player-setting.interface'
import { v4 as uuidv4 } from 'uuid'

export type GameMode = 'time-survival' | 'battle-royale'
export class Game {
  public id: string
  private _mode: GameMode
  private _players: IPlayer[]
  private _boxes: Box[] = []
  private boxCreationProbability = 0.075
  public startTimestamp: number = Date.now()
  private _lastTimestamp: number = Date.now()
  get mode() {
    return this._mode
  }
  get players() {
    return this._players
  }
  get computers() {
    return this._players.filter((player) => player instanceof ComputerPlayer)
  }
  get boxes() {
    return this._boxes
  }
  get lastTimestamp() {
    return this._lastTimestamp
  }
  constructor(params: {
    id?: string
    mode: GameMode
    players: IPlayer[]
  }) {
    this.id = params.id || uuidv4()
    this._players = params.players || []
    this._mode = params.mode
  }

  processPlayers(deltaTime: number) {
    for (const player of this.players) {
      if (player instanceof ComputerPlayer) {
        player.decideNextMove(this.boxes)
        player.moveOnIdle(deltaTime)
        player.isGameOver()
      }
    }
  }

  processBoxes(deltaTime: number) {
    for (const box of this.boxes) {
      box.moveOnIdle(deltaTime)
      if (box.isOutOfDisplay()) {
        this.deleteBox(box)
      }
      this.players.forEach((player) => {
        if (
          player instanceof ComputerPlayer &&
          player.isPlayerCollidingWithBox(box)
        )
          player.moveOnTopBox(box.y)
      })
    }
    if (Math.random() < this.boxCreationProbability) {
      this.createBox()
    }
  }

  private createBox() {
    const box = Box.createBox()
    this.boxes.push(box)
  }

  private deleteBox(box: Box) {
    const index = this.boxes.indexOf(box)
    this.boxes.splice(index, 1)
  }

  updateCurrentTime(timestamp: number) {
    this._lastTimestamp = timestamp
  }

  addPlayer(player: IPlayer) {
    this.players.push(player)
  }

  setupPlayers(playerSetting: PlayerSetting) {
    const spacing = 1 / (this.players.length + 1)
    this.players.forEach((player, i) => {
      player.reset(playerSetting)
      player.x = spacing * (i + 1)
      player.timestamp = Date.now()
    })
  }

  shouldTerminate() {
    return this.isGameOver() || this.isNoPlayer()
  }

  private isGameOver() {
    return this.players.every((player) => player.isOver)
  }

  private isNoPlayer() {
    return this.players.length === 0
  }

  outputGameResult() {
    return this.players
      .map((player) => {
        const playerData = player.convertToJson()
        return {
          name: playerData.name,
          timestamp: playerData.timestamp,
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp)
  }
}

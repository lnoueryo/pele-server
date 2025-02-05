import { Player } from './player.entity'
import { Box } from './box.entity'
import { ComputerPlayer } from './computer.entiry'
import { IPlayer, PlayerSetting } from './interfaces/player-setting.interface'
import { v4 as uuidv4 } from 'uuid'

const MILLISECONDS_PER_SECOND = 1000
const PLAYER_DELAY = 1000
export type GameMode = 'time-survival' | 'battle-royale'
export class Game {
  private id: string
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
  constructor(params: { players: IPlayer[]; mode: GameMode }) {
    this.id = uuidv4()
    this._players = params.players || []
    this._mode = params.mode
  }

  loop() {
    const currentTimestamp = Date.now()
    const deltaTime =
      (currentTimestamp - this.lastTimestamp) / MILLISECONDS_PER_SECOND
    this._lastTimestamp = currentTimestamp
    if (currentTimestamp - this.startTimestamp > PLAYER_DELAY) {
      for (const player of this.players) {
        if (player instanceof ComputerPlayer) {
          player.decideNextMove(this.boxes)
          player.moveOnIdle(deltaTime)
          player.isGameOver()
        }
      }
    }
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
    return currentTimestamp
  }

  private createBox() {
    const box = Box.createBox()
    this.boxes.push(box)
  }

  private deleteBox(box: Box) {
    const index = this.boxes.indexOf(box)
    this.boxes.splice(index, 1)
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

  updatePlayers(players: Player[]) {
    return new Game({
      players,
      mode: this._mode,
    })
  }

  resetGame(players: Player[]) {
    return new Game({
      players,
      mode: this._mode,
    })
  }

  isGameOver() {
    return this.players.every((player) => player.isOver)
  }

  isNoPlayer() {
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

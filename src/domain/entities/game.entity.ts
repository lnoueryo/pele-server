import { Player } from './player.entity'
import { Box } from './box.entity'
import { ComputerPlayer } from './computer.entiry'
import { IPlayer } from './interfaces/player-setting.interface'

const MILLISECONDS_PER_SECOND = 1000
const PLAYER_DELAY = 1000

export class Game {
  private _players: IPlayer[]
  private _boxes: Box[] = []
  private boxCreationProbability = 0.075
  public lastTimestamp: number = Date.now()
  constructor(params: { players: IPlayer[] }) {
    this._players = params.players || []
  }

  loop(startTimestamp: number) {
    const currentTimestamp = Date.now()
    const deltaTime =
      (currentTimestamp - this.lastTimestamp) / MILLISECONDS_PER_SECOND
    this.lastTimestamp = currentTimestamp
    if (currentTimestamp - startTimestamp > PLAYER_DELAY) {
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

  updatePlayers(players: Player[]) {
    return new Game({
      players,
    })
  }

  resetGame(players: Player[]) {
    return new Game({
      players,
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

  get players() {
    return this._players
  }

  get computers() {
    return this._players.filter((player) => player instanceof ComputerPlayer)
  }

  get boxes() {
    return this._boxes
  }
}

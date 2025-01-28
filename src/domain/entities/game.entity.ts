import { Player } from './player.entity'
import { Box } from './box.entity'

export class Game {
  private players
  public boxes: Box[] = []
  private boxCreationProbability = 0.075
  public startTime: number = 0
  public currentTime: number = 0
  public lastTimestamp: number = 0
  constructor(params: { players: Player[] }) {
    this.players = params.players || []
  }

  loop(deltaTime: number) {
    // TODO: サーバー側で時間管理
    for (const box of this.boxes) {
      box.moveOnIdle(deltaTime)
      if (box.isOutOfDisplay()) {
        this.deleteBox(box)
      }
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
}

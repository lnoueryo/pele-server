import { Player } from './player'
import { Box } from './box'
const PLAYER_START = 3000
export class Game {
  private players
  public boxes: Box[] = []
  private boxCreationProbability = 0.08
  public startTime: number = 0
  public currentTime: number = 0
  constructor(params: { players: Player[] }) {
    this.players = params.players || []
  }

  startGame = () => {
    // this.loop(this.currentTime)
    setTimeout(() => {

    }, PLAYER_START)
  }

  loop() {
    // this.currentTime = timestamp
    for (const box of this.boxes) {
      box.moveOnIdle()
      if (box.isOutOfDisplay()) {
        this.deleteBox(box)
      }
    }
    if (Math.random() < this.boxCreationProbability) {
      this.createBox()
    }

  }

  private createBox() {
    const x = 0
    const y = 0.17
    const width = Math.random()
    const height = getRandomWithMin(0.1) * 0.1
    // const speed = getRandomWithMin(0.05) * 0.01
    let speed = (Math.random() - 0.5) * 0.07
    if (0 < speed && speed < 0.005) {
      speed = 0.005
    } else if (-0.005 < speed && speed < 0) {
      speed = -0.005
    }
    if (0.015 < speed) {
      speed = 0.015
    } else if (speed < -0.015) {
      speed = -0.015
    }
    console.log(speed)
    // const speed = Math.random() * 0.01
    const box = new Box({
      x,
      y,
      width,
      height,
      speed,
    })
    this.boxes.push(box)
    function getRandomWithMin(min) {
      return Math.random() * (1 - min) + min;
    }
    function getRandomWithMax(max) {
      return Math.random() * (1 - max) + max;
    }
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

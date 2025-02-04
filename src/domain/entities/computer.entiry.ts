import { Box } from './box.entity'
import { IServerGameObject } from './interfaces/game-object.interface'
import { IPlayer, PlayerSetting } from './interfaces/player-setting.interface'

export type ComputerMode = 'slowest' | 'fastest' | 'highest' | 'nearest'
export type ComputerSetting = {
  id: string
  name: string
  mode: ComputerMode
  color: string
}
export class ComputerPlayer implements IServerGameObject, IPlayer {
  public id: string
  public name: string
  private mode: ComputerMode = 'nearest'
  public x: number
  public y: number
  public width: number
  public height: number
  public speed: number
  private vg: number
  public vx: number
  public vy: number
  private jumpStrength: number
  private color: string
  public isOver: boolean
  private isJumping: boolean
  public timestamp: number
  constructor(params: {
    id: string
    name: string
    mode: ComputerMode
    x: number
    y: number
    width: number
    height: number
    speed: number
    vx: number
    vy: number
    vg: number
    jumpStrength: number
    color: string
    isOver: boolean
    isJumping: boolean
    timestamp: number
  }) {
    this.id = params.id
    this.name = params.name
    this.mode = params.mode
    this.x = params.x
    this.y = params.y
    this.width = params.width
    this.height = params.height
    this.speed = params.speed
    this.vx = params.vx
    this.vy = params.vy
    this.vg = params.vg
    this.jumpStrength = params.jumpStrength
    this.color = params.color
    this.isOver = params.isOver
    this.isJumping = params.isJumping
    this.timestamp = params.timestamp || 0
  }

  decideNextMove(boxes: Box[]) {
    if (boxes.length === 0) return
    const candidates = this.getCandidateBoxes(boxes)
    let targetBox = this.getTargetBox(candidates, this.mode)

    // **目標のボックスが上にある**
    if (!this.isJumping && targetBox.y < this.y) {
      this.jump()
    }
    if (
      Math.abs(this.x - targetBox.x - targetBox.width) < 0.05 &&
      Math.abs(this.y - targetBox.y) < 0.05
    ) {
      const candidates = this.getCandidateBoxes(boxes)
      targetBox = this.getTargetBox(candidates, 'nearest')
    }
    const moveDirection = this.x < targetBox.x ? 1 : -1
    const speedFactor = 0.9
    this.vx += moveDirection * speedFactor
    if (Math.abs(this.vx) > 0.25) this.vx *= 0.4
    boxes.forEach((box) => {
      if (this.isPlayerCollidingWithBox(box)) {
        this.vx *= 0.1
      }
    })
  }

  private getCandidateBoxes(boxes: Box[]) {
    const candidates = boxes.filter(
      (box) =>
        box.x >= 0.3 &&
        box.x <= 0.9 &&
        box.y <= 0.7 &&
        box.y >= 0.1 &&
        box.speed < 0.6,
    )
    return candidates.length === 0 ? boxes : candidates
  }

  private getTargetBox(candidates: Box[], mode: ComputerMode) {
    switch (mode) {
      case 'slowest':
        return candidates.reduce((slowestBox, currentBox) => {
          return currentBox.speed < slowestBox.speed ? currentBox : slowestBox
        }, candidates[0])

      case 'fastest':
        return candidates.reduce((fastestBox, currentBox) => {
          return currentBox.speed > fastestBox.speed ? currentBox : fastestBox
        }, candidates[0])

      case 'highest':
        return candidates.reduce((highest, box) => {
          return box.y < highest.y ? box : highest
        }, candidates[0])

      case 'nearest':
        return candidates.reduce((nearestBox, currentBox) => {
          return this.calculateDistance(currentBox) <
            this.calculateDistance(nearestBox)
            ? currentBox
            : nearestBox
        }, candidates[0])
    }
  }

  private calculateDistance(box: Box) {
    // d**2 = x**2 + y**2
    const { x, y } = box.convertToJson()
    const deltaX = x - this.x
    const deltaY = y - this.y
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
  }

  moveOnIdle(deltaTime: number) {
    this.vy += this.vg * deltaTime
    this.x += this.vx * deltaTime
    this.y += this.vy * deltaTime
  }

  moveOnTopBox(boxY: number) {
    this.y = boxY - this.height
    this.vy = 0
    this.isJumping = false
  }

  private jump() {
    this.vy = this.jumpStrength
    this.isJumping = true
  }

  isPlayerCollidingWithBox(box: Box) {
    return (
      this.x + this.width > box.x &&
      this.x < box.x + box.width &&
      this.y + this.height > box.y &&
      this.y < box.y + box.height &&
      this.vy >= 0
    )
  }

  isGameOver() {
    if (this.isOver) return
    this.isOver = this.y - this.height > 1
    this.timestamp = Date.now()
  }

  reset(playerSetting: PlayerSetting) {
    this.x = playerSetting.x
    this.y = playerSetting.y
    this.width = playerSetting.width
    this.height = playerSetting.height
    this.vg = playerSetting.vg
    this.speed = playerSetting.speed
    this.jumpStrength = playerSetting.jumpStrength
    this.isOver = false
    this.timestamp = 0
  }

  convertToJson() {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      vg: this.vg,
      jumpStrength: this.jumpStrength,
      speed: this.speed,
      color: this.color,
      isOver: this.isOver,
      timestamp: this.timestamp,
    }
  }

  static createPlayer = (
    id: string,
    name: string,
    mode: ComputerMode,
    color: string,
    playerSetting: PlayerSetting,
  ) => {
    return new ComputerPlayer({
      id,
      name,
      mode,
      vx: 0,
      vy: 0,
      ...playerSetting,
      color,
      isJumping: false,
      isOver: false,
      timestamp: 0,
    })
  }
}

import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { IPlayerRepository } from '../repositories/memory/player.repository.interface'
import { Player } from '../entities/player.entity'
import config from '../../config'

@Injectable()
export class PlayerService {
  constructor(
    @Inject(forwardRef(() => IPlayerRepository))
    private readonly playerRepository: IPlayerRepository,
  ) {}
  arrangePosition(): Player[] {
    const players = this.playerRepository.findAll()
    const spacing = 1 / (players.length + 1)
    return players.map((player, i) => {
      player.x = spacing * (i + 1)
      return player
    })
  }
  resetPosition() {
    const players = this.playerRepository.findAll()
    return players.map((player) => {
      player.reset({
        ...config.playerSetting,
      })
    })
  }
}

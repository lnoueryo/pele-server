import { Injectable } from '@nestjs/common'
import { PlayerSetting } from 'src/domain/entities/interfaces/player-setting.interface'
import { Player } from 'src/domain/entities/player.entity'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'

@Injectable()
export class PlayerRepository implements IPlayerRepository {
  private players: Map<string, Player> = new Map()

  findAll(): Player[] {
    return [...this.players.values()]
  }

  findById(id: string): Player | null {
    return this.players.get(id) || null
  }

  findByClientId(clientId: string): Player | null {
    return this.findAll().find((player) => player.clientId === clientId)
  }

  save(player: Player): void {
    this.players.set(player.id, player)
  }

  delete(id: string): void {
    this.players.delete(id)
  }

  exists(id: string): boolean {
    return this.players.has(id)
  }

  reset(playerSetting: PlayerSetting) {
    this.findAll().forEach((player) => {
      player.reset(playerSetting)
    })
  }
}

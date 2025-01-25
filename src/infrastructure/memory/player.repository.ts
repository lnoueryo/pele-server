import { Injectable } from '@nestjs/common'
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

  save(player: Player): void {
    this.players.set(player.id, player)
  }

  delete(id: string): void {
    this.players.delete(id)
  }

  exists(id: string): boolean {
    return this.players.has(id)
  }
}

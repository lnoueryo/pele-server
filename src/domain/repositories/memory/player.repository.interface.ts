import { PlayerSetting } from 'src/domain/entities/interfaces/player-setting.interface'
import { Player } from 'src/domain/entities/player.entity'
export const IPlayerRepository = Symbol('IPlayerRepository')
export type IPlayerRepository = {
  findAll(): Player[]
  findById(id: string): Player | null
  findByClientId(clientId: string): Player | null
  save(player: Player): void
  delete(id: string): void
  exists(id: string): boolean
}

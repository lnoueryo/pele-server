import config from '../../../config'
import { Player } from '../../entities/player.entity'

export class GameSetupService {
  setupPlayers(players: Player[]): Player[] {
    const spacing = 1 / (players.length + 1)
    players.forEach((player, i) => {
      player.reset({ ...config.playerSetting })
      player.x = spacing * (i + 1)
      player.timestamp = Date.now()
    })
    return players
  }
}

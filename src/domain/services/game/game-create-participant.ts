import { ComputerPlayer } from 'src/domain/entities/computer.entiry'
import { Game } from 'src/domain/entities/game.entity'
import config from '../../../config'

const MAX_PLAYER_NUM = 5

export class GameCreateParticipantService {
  createParticipants(game: Game): void {
    if (game.mode === 'battle-royale') {
      for (const computer of config.computerSetting) {
        if (game.players.length === MAX_PLAYER_NUM) {
          break
        }
        const newComputer = ComputerPlayer.createPlayer(
          computer.id,
          computer.name,
          computer.mode,
          computer.color,
          config.playerSetting,
        )
        game.addPlayer(newComputer)
      }
    }
  }
}

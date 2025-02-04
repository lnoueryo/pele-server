import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Game } from 'src/domain/entities/game.entity'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { IGameNotifier } from 'src/domain/notifiers/game.notifier.interface'
import { UsecaseResult } from './shared/usecase-result'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import { GameSetupService } from 'src/domain/services/game/game-setup.service'
import { GameStartService } from 'src/domain/services/game/game-start.service'
import { IPlayer } from 'src/domain/entities/interfaces/player-setting.interface'
import { ComputerPlayer } from 'src/domain/entities/computer.entiry'
import config from 'src/config'
import { GameMode } from './shared/game-mode'

const MAX_PLAYER_NUM = 5

@Injectable()
export class StartGameUsecase {
  private isGameRunning = false
  constructor(
    @Inject(forwardRef(() => IPlayerRepository))
    private readonly playerRepository: IPlayerRepository,
    @Inject(forwardRef(() => IGameNotifier))
    private readonly gameNotifier: IGameNotifier,
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
    private readonly gameSetupService: GameSetupService,
    private readonly gameStartService: GameStartService,
  ) {}
  async execute(mode: GameMode): Promise<UsecaseResult<true, 'internal'>> {
    // もしゲーム中にAPIを叩かれても何も起きない
    if (this.isGameRunning) return { success: true }
    this.isGameRunning = true
    // positionをリセットし、プレイヤーを並べる
    const players: IPlayer[] = this.playerRepository.findAll()
    if (mode === 'battle-royale') {
      for (const computer of config.computerSetting) {
        if (players.length === MAX_PLAYER_NUM) {
          break
        }
        const newComputer = ComputerPlayer.createPlayer(
          computer.id,
          computer.name,
          computer.mode,
          computer.color,
          config.playerSetting,
        )
        players.push(newComputer)
      }
    }
    this.gameSetupService.setupPlayers(players)
    const clients = this.websocketClientRepository.findAll()
    this.gameNotifier.startGame(players, { clients })
    try {
      const game = new Game({ players })
      await this.gameStartService.run(game)
      Logger.log('Done')
      return { success: true }
    } catch (error) {
      Logger.error(error)
      return {
        error: {
          type: 'internal',
          message: 'Internal server error',
        },
      }
    } finally {
      this.isGameRunning = false
    }
  }
}

import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { Game } from 'src/domain/entities/game.entity'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { IGameResultRepository } from 'src/domain/repositories/db/game-result.repository.interface'
import { IGameNotifier } from 'src/domain/notifiers/game.notifier.interface'
import { UsecaseResult } from './shared/usecase-result'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import { GameStartService } from 'src/domain/services/game/game-start.service'
import { IPlayer } from 'src/domain/entities/interfaces/player-setting.interface'
import config from 'src/config'
import { GameMode } from './shared/game-mode'
import { GameCreateParticipantService } from 'src/domain/services/game/game-create-participant'
import { GameResult } from 'src/domain/entities/game-result.entity'
import { Player } from 'src/domain/entities/player.entity'

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
    @Inject(forwardRef(() => IGameResultRepository))
    private readonly gameResultRepository: IGameResultRepository,
    private readonly gameCreateParticipantService: GameCreateParticipantService,
    private readonly gameStartService: GameStartService,
  ) {}
  async execute(mode: GameMode): Promise<UsecaseResult<true, 'internal'>> {
    // もしゲーム中にAPIを叩かれても何も起きない
    if (this.isGameRunning) return { success: true }
    this.isGameRunning = true
    // positionをリセットし、プレイヤーを並べる
    const players: IPlayer[] = this.playerRepository.findAll()
    const game = new Game({ players, mode })
    this.gameCreateParticipantService.createParticipants(game)
    game.setupPlayers(config.playerSetting)
    const clients = this.websocketClientRepository.findAll()
    this.gameNotifier.startGame(game.players, { clients })
    try {
      await this.gameStartService.run(game)
      Logger.log('Done')
      const clients = this.websocketClientRepository.findAll()
      this.gameNotifier.endGame(
        { ranking: game.outputGameResult(), startTimestamp: game.startTimestamp },
        { clients },
      )
      game.players.forEach(async(player) => {
        if (player instanceof Player) {
          await this.gameResultRepository.save(new GameResult({
            gameId: game.id,
            userId: player.id,
            startTimestamp: new Date(game.startTimestamp),
            lastTimestamp: new Date(game.lastTimestamp),
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        }
      })
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

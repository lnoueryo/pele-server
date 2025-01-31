import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import { IGameNotifier } from 'src/domain/notifiers/game.notifier.interface'

@Injectable()
export class DisconnectWebsocketUsecase {
  constructor(
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
    @Inject(forwardRef(() => IGameNotifier))
    private readonly websocketGameRepository: IGameNotifier,
    @Inject(forwardRef(() => IPlayerRepository))
    private readonly playerRepository: IPlayerRepository,
  ) {}
  execute(client: IWebsocketClient) {
    try {
      this.websocketClientRepository.delete(client.id)
      const player = this.playerRepository.findByClientId(client.id)
      this.playerRepository.delete(player.id)
      Logger.log(`disconnected ${client.id}`)
      const clients = this.websocketClientRepository.findAll()
      const players = this.playerRepository.findAll()
      this.websocketGameRepository.acceptPlayer(players, { clients })
    } catch (error) {
      Logger.error(error)
    }
  }
}

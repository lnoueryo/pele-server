import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import { IWebsocketGameRepository } from 'src/domain/repositories/websocket/game.repository'

@Injectable()
export class DisconnectWebsocketUsecase {
  constructor(
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
    @Inject(forwardRef(() => IWebsocketGameRepository))
    private readonly websocketGameRepository: IWebsocketGameRepository,
    @Inject(forwardRef(() => IPlayerRepository))
    private readonly playerRepository: IPlayerRepository,
  ) {}
  execute(client: IWebsocketClient) {
    try {
      this.websocketClientRepository.delete(client.id)
      this.playerRepository.findByClientId(client.id)
      this.playerRepository.delete(client.id)
      Logger.log(`disconnected ${client.id}`)
      const clients = this.websocketClientRepository.findAll()
      const players = this.playerRepository.findAll()
      this.websocketGameRepository.acceptPlayer(players, { clients })
    } catch (error) {
      Logger.error(error)
    }
  }
}

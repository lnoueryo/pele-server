import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import { IWebsocketGameRepository } from 'src/domain/repositories/websocket/game.repository'

@Injectable()
export class ConnectWebsocketUsecase {
  constructor(
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
    @Inject(forwardRef(() => IWebsocketGameRepository))
    private readonly websocketGameRepository: IWebsocketGameRepository,
  ) {}
  execute(client: IWebsocketClient) {
    this.websocketClientRepository.save(client)
    this.websocketGameRepository.connectWebsocket(client.id, {
      clients: [client],
    })
    Logger.log(`connected: ${client.id}`)
  }
}

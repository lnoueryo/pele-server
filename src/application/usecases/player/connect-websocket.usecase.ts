import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import { IWebsocketGameRepository } from 'src/domain/repositories/websocket/game.repository'

@Injectable()
export class ConnectWebsocketUsecase {
  constructor(
    @Inject(forwardRef(() => IWebsocketClientRepository))
    private readonly websocketClientRepository: IWebsocketClientRepository,
  ) {}
  execute(client: IWebsocketClient) {
    this.websocketClientRepository.save(client)
  }
}

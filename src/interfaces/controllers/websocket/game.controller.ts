import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { UpdatePlayerUsecase } from 'src/application/usecases/player/update-player.usecase'
import { CreatePlayerUsecase } from 'src/application/usecases/player/create-player.usecase'
import { StartGameUsecase } from 'src/application/usecases/player/start-game.usecase'
import { SocketIO } from 'src/infrastructure/plugins/socket.io'
import { ConnectWebsocketUsecase } from 'src/application/usecases/player/connect-websocket.usecase'
import { DisconnectWebsocketUsecase } from 'src/application/usecases/player/disconnect-websocket.usecase'

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: '*',
  },
  pingTimeout: 99999999,
})
export class GameController {
  constructor(
    private readonly createPlayerUsecase: CreatePlayerUsecase,
    private readonly updatePlayerUsecase: UpdatePlayerUsecase,
    private readonly startGameUsecase: StartGameUsecase,
    private readonly connectWebsocketUsecase: ConnectWebsocketUsecase,
    private readonly disconnectWebsocketUsecase: DisconnectWebsocketUsecase,
  ) {}

  handleConnection(client: Socket) {
    this.connectWebsocketUsecase.execute(new SocketIO(client))
  }

  handleDisconnect(client: Socket) {
    this.disconnectWebsocketUsecase.execute(new SocketIO(client))
  }

  @SubscribeMessage('player')
  createPlayerMessage(
    @MessageBody() user: { uid: string; displayName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const result = this.createPlayerUsecase.execute(user, new SocketIO(client))
    if ('error' in result) {
      return
    }
  }

  @SubscribeMessage('position')
  async updatePlayerPosition(
    @MessageBody()
    body: {
      id: string
      x: number
      y: number
      width: number
      height: number
      isOver: boolean
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.updatePlayerUsecase.execute(body, new SocketIO(client))
  }

  @SubscribeMessage('start')
  async startGame() {
    await this.startGameUsecase.execute()
  }
}

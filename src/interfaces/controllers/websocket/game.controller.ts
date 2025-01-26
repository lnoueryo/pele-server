import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Player } from 'src/domain/entities/player.entity'
import { UpdatePlayerUsecase } from 'src/application/usecases/player/update-player.usecase'
import { Inject } from '@nestjs/common'
import { CreatePlayerUsecase } from 'src/application/usecases/player/create-player.usecase'
import { StartGameUsecase } from 'src/application/usecases/player/start-game.usecase'
import { IPlayerRepository } from 'src/domain/repositories/memory/player.repository.interface'
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
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    const result = this.createPlayerUsecase.execute(id, new SocketIO(client))
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
  async startGame(@ConnectedSocket() client: Socket) {
    await this.startGameUsecase.execute(new SocketIO(client))
  }

  // @SubscribeMessage('start')
  // async startGame(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  //   this.wsClients.forEach(
  //     (client) => client.id !== data.id && client.emit('start'),
  //   )
  //   if (this.isGameStarted) return
  //   this.isGameStarted = true
  //   // let cachePlayers = this.deepCopyPlayers(this.players)
  //   // const timer = setInterval(() => {
  //   //   for (const [id, cachedPlayer] of cachePlayers.entries()) {
  //   //     const currentPlayer = this.players.get(id)
  //   //     if (!currentPlayer) {
  //   //       return
  //   //     } else if (currentPlayer.x === cachedPlayer.x && currentPlayer.y === cachedPlayer.y) {
  //   //       currentPlayer.isOver = true
  //   //       console.log(`isOver ${currentPlayer}`)
  //   //     }
  //   //   }
  //   //   cachePlayers = this.deepCopyPlayers(this.players)
  //   // }, 5000)
  //   try {
  //     const players = Array.from(this.players.values())
  //     const game = new Game({ players })
  //     while (true) {
  //       game.loop()
  //       const boxes = game.boxes.map((box) => {
  //         const buffer = new ArrayBuffer(20) // 5つのFloat32 (4バイト * 5 = 20バイト)
  //         const view = new DataView(buffer)
  //         view.setFloat32(0, box.x)
  //         view.setFloat32(4, box.y)
  //         view.setFloat32(8, box.width)
  //         view.setFloat32(12, box.height)
  //         view.setFloat32(16, box.speed)
  //         return buffer
  //       })
  //       console.log(boxes)
  //       this.broadcast('stage', boxes)
  //       await new Promise((resolve) => setTimeout(resolve, 1000 / 60))
  //       if (game.isGameOver() || this.players.size === 0) {
  //         break
  //       }
  //     }
  //     console.log('Done')
  //   } catch (error) {
  //     console.error('An error occurred in the game loop:', error)
  //   } finally {
  //     this.isGameStarted = false
  //     // clearInterval(timer)
  //   }
  // }

  private deepCopyPlayers(players: Map<string, Player>): Map<string, Player> {
    const copy = new Map<string, Player>()
    for (const [key, player] of players.entries()) {
      copy.set(key, JSON.parse(JSON.stringify(player)))
    }
    return copy
  }
}

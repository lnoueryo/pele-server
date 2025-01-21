import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Game } from 'src/domain/entities/game.entity'
import { Player } from 'src/domain/entities/player'

@WebSocketGateway({
  namespace: '/player',
  cors: {
    origin: '*',
  },
})
export class PlayerController {
  @WebSocketServer()
  server: Server

  private wsClients = []
  private isGameStarted = false
  private players = new Map()

  handleConnection(client) {
    console.log('connected')
    this.wsClients.push(client)
    client.emit('login', client.id)
  }

  handleDisconnect(client: any) {
    console.log('disconnected')
    this.wsClients = this.wsClients.filter((c) => c !== client)
    this.players.delete(client.id)
    this.broadcast('join', Array.from(this.players.values()))
  }

  @SubscribeMessage('coordinate')
  async coordinate(@MessageBody() data: any) {
    try {
      const player = this.players.get(data.id)
      player.updateFromJson(data)
      this.broadcast('coordinate', data)
    } catch (error) {
      console.error(error)
    }
  }
  @SubscribeMessage('start')
  async start(@MessageBody() data: any) {
    this.wsClients.forEach((client) => client.id !== data.id && client.emit('start'))
    if (this.isGameStarted) return
      this.isGameStarted = true
      let cachePlayers = this.deepCopyPlayers(this.players)
      const timer = setInterval(() => {
        for (const [id, cachedPlayer] of cachePlayers.entries()) {
          const currentPlayer = this.players.get(id)
          if (!currentPlayer) {
            return
          } else if (currentPlayer.x === cachedPlayer.x && currentPlayer.y === cachedPlayer.y) {
            currentPlayer.isOver = true
            console.log(`isOver ${currentPlayer}`)
          }
        }
        cachePlayers = this.deepCopyPlayers(this.players)
      }, 5000)
    try {
      const players = Array.from(this.players.values())
      const game = new Game({ players })
      while (true) {
        game.loop()
        const bb = game.boxes.map((box) => {
          const buffer = new ArrayBuffer(20) // 5つのFloat32 (4バイト * 5 = 20バイト)
          const view = new DataView(buffer)
          view.setFloat32(0, box.x)
          view.setFloat32(4, box.y)
          view.setFloat32(8, box.width)
          view.setFloat32(12, box.height)
          view.setFloat32(16, box.speed)
          return buffer // バッファを直接返す
        })
        this.broadcast('stage', bb)
        // this.broadcast('stage', game.boxes)
        await new Promise(resolve => setTimeout(resolve, 1000 / 60))
        if (game.isGameOver() || this.players.size === 0) {
          break
        }
      }
      console.log('Done')
    } catch (error) {
      console.error('An error occurred in the game loop:', error)
    } finally {
      this.isGameStarted = false
      clearInterval(timer)
    }
  }

  @SubscribeMessage('login')
  emitLoginMessage(@MessageBody() player: any) {
    const playerObj = new Player(player.player)
    this.players.set(player.clientId, playerObj)
    this.broadcast('join', Array.from(this.players.values()).map((player) => player.convertToJson()))
  }

  private broadcast(event: string, message: any) {
    for (const c of this.wsClients) {
      c.emit(event, message)
    }
  }
  private deepCopyPlayers(players: Map<string, Player>): Map<string, Player> {
    const copy = new Map<string, Player>()
    for (const [key, player] of players.entries()) {
      copy.set(key, JSON.parse(JSON.stringify(player)))
    }
    return copy
  }
}

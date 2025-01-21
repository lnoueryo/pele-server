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
  pingTimeout: 10000, // クライアントが "pong" を返さなかった場合のタイムアウト（ms）
  pingInterval: 25000, // サーバーが "ping" を送信する間隔（ms）
})
export class PlayerController {
  @WebSocketServer()
  server: Server

  wsClients = []
  players = new Map()

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
    try {
      const players = Array.from(this.players.values())
      const game = new Game({ players })
      let lastTime = Date.now();
      while (true) {
        const currentTime = Date.now();
        const deltaTime = (currentTime - lastTime) / 1000; // 秒単位
        lastTime = currentTime;
      
        game.loop(deltaTime); // deltaTime を基に更新
        this.broadcast('stage', { boxes: game.boxes });
      
        if (game.isGameOver()) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 16));
      }

      console.log('Done')
    } catch (error) {
      console.error('An error occurred in the game loop:', error)
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
}

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({
  namespace: '/player',
  cors: {
    origin: '*',
  },
})
export class PlayerWebSocketGateway {
  @WebSocketServer()
  server: Server

  wsClients = []
  players = new Map()

  handleConnection(client) {
    this.wsClients.push(client)
    client.emit('login', client.id)
  }

  handleDisconnect(client: any) {
    this.wsClients = this.wsClients.filter((c) => c !== client)
    this.players.delete(client.id)
    this.broadcast('join', Array.from(this.players.values()))
  }

  @SubscribeMessage('coordinate')
  coordinate(@MessageBody() data: any) {
    this.broadcast('coordinate', data)
  }
  @SubscribeMessage('start')
  start(@MessageBody() data: any) {
    this.wsClients.forEach((client) => client.id !== data.id && client.emit('start'))
  }

  @SubscribeMessage('login')
  emitLoginMessage(@MessageBody() player: any) {
    this.players.set(player.clientId, player.player)
    this.broadcast('join', Array.from(this.players.values()))
  }

  private broadcast(event: string, message: any) {
    for (const c of this.wsClients) {
      c.emit(event, message)
    }
  }
}

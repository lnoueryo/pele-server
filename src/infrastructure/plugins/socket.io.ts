import { Socket } from 'socket.io'
import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'

export class SocketIO implements IWebsocketClient {
  constructor(private readonly socket: Socket) {}
  broadcast<T>(event: string, payload: T): void {
    this.socket.broadcast.emit(event, payload)
  }
  emit<T>(event: string, payload: T): void {
    this.socket.emit(event, payload)
  }
  get id() {
    return this.socket.id
  }
}

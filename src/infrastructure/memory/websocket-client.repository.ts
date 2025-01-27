import { Injectable } from '@nestjs/common'
import { IWebsocketClientRepository } from 'src/domain/repositories/memory/websocket-client.repository.interface'
import { SocketIO } from '../plugins/socket.io'

@Injectable()
export class WebsocketClientRepository implements IWebsocketClientRepository {
  private wsClients: Map<string, SocketIO> = new Map()

  findAll(): SocketIO[] {
    return [...this.wsClients.values()]
  }

  findById(id: string): SocketIO | null {
    return this.wsClients.get(id) || null
  }

  save(wsClient: SocketIO): void {
    this.wsClients.set(wsClient.id, wsClient)
  }

  delete(id: string): void {
    this.wsClients.delete(id)
  }

  exists(id: string): boolean {
    return this.wsClients.has(id)
  }
}

import { IWebsocketClient } from 'src/domain/entities/interfaces/websocket-client.interface'
export const IWebsocketClientRepository = Symbol('IWebsocketClientRepository')
export type IWebsocketClientRepository = {
  findAll(): IWebsocketClient[]
  findById(id: string): IWebsocketClient | null
  save(wsClient: IWebsocketClient): void
  delete(id: string): void
  exists(id: string): boolean
}

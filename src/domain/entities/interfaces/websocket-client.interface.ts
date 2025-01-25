export interface IWebsocketClient {
  id: string
  emit(event: string, message: unknown): void
  broadcast<T>(event: string, payload: T): void
  emit<T>(event: string, payload: T): void
}

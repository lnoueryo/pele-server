import { Module } from '@nestjs/common'
import { PlayerWebSocketGateway } from '../websocket/player.websocket.gateway'

@Module({
  providers: [PlayerWebSocketGateway],
})
export class PlayerModule {}

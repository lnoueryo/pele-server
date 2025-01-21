import { PlayerController } from './../../interfaces/controllers/websocket/player.controller'
import { Module } from '@nestjs/common'

@Module({
  providers: [PlayerController],
})
export class PlayerModule {}

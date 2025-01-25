import { GameController } from '../../interfaces/controllers/websocket/game.controller'
import { Module } from '@nestjs/common'

@Module({
  providers: [GameController],
})
export class GameModule {}

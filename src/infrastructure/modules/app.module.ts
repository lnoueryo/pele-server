import { Module } from '@nestjs/common'
import { GameModule } from './game.module'
import { PlayerModule } from './player.module'

@Module({
  imports: [GameModule, PlayerModule],
})
export class AppModule {}

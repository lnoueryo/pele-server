import { Module } from '@nestjs/common'
import { GameModule } from './game.module'
import { ObjectModule } from './object.module'
import { GameResultModule } from './game-result.module'

@Module({
  imports: [GameModule, ObjectModule, GameResultModule],
})
export class AppModule {}

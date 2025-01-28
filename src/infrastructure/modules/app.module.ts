import { Module } from '@nestjs/common'
import { GameModule } from './game.module'
import { ObjectModule } from './object.module'

@Module({
  imports: [GameModule, ObjectModule],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { PlayerController } from 'src/interfaces/controllers/http/player.controller'

@Module({
  controllers: [PlayerController],
})
export class PlayerModule {}

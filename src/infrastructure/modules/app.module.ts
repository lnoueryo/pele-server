import { Module } from '@nestjs/common';
import { PlayerModule } from './player.module'

@Module({
  imports: [PlayerModule],
})
export class AppModule {}

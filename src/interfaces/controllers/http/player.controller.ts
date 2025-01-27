import { Controller, Get } from '@nestjs/common'
import config from '../../../config'

@Controller('players')
export class PlayerController {
  @Get()
  getPlayerSetting() {
    return config.playerSetting
  }
}

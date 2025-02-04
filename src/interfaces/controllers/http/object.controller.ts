import { Controller, Get } from '@nestjs/common'
import config from '../../../config'

@Controller('objects')
export class ObjectController {
  @Get()
  getObjectSetting() {
    return {
      playerSetting: config.playerSetting,
      boxSetting: config.boxSetting,
      computerSetting: config.computerSetting,
    }
  }
}

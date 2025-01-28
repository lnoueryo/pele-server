import { Module } from '@nestjs/common'
import { ObjectController } from 'src/interfaces/controllers/http/object.controller'

@Module({
  controllers: [ObjectController],
})
export class ObjectModule {}

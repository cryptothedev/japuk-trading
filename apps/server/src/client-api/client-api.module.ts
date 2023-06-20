import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { AlertLogController } from './alert-log.controller'
import { AlertLogGateway } from './alert-log.gateway'

@Module({
  imports: [CoreModule],
  controllers: [AlertLogController],
  providers: [AlertLogGateway],
})
export class ClientApiModule {}

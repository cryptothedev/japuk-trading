import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { DatabaseModule } from '../database/database.module'
import { AlertLogController } from './alert-log.controller'
import { AlertLogGateway } from './alert-log.gateway'
import { AlertLogService } from './alert-log.service'

@Module({
  imports: [CoreModule, DatabaseModule],
  controllers: [AlertLogController],
  providers: [AlertLogGateway, AlertLogService],
  exports: [AlertLogGateway, AlertLogService],
})
export class ClientApiModule {}

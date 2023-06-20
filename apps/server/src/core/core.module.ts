import { Module } from '@nestjs/common'

import { ConfigService } from './config.service'
import { LogService } from './log.service'

@Module({
  providers: [LogService, ConfigService],
  exports: [ConfigService, LogService],
})
export class CoreModule {}

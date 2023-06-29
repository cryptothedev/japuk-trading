import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { DatabaseModule } from '../database/database.module'
import { AlertLogController } from './alert-log/alert-log.controller'
import { AlertLogGateway } from './alert-log/alert-log.gateway'
import { AlertLogService } from './alert-log/alert-log.service'
import { SettingService } from './setting/setting.service';
import { SettingController } from './setting/setting.controller';

@Module({
  imports: [CoreModule, DatabaseModule],
  controllers: [AlertLogController, SettingController],
  providers: [AlertLogGateway, AlertLogService, SettingService],
  exports: [AlertLogGateway, AlertLogService],
})
export class ClientApiModule {}

import { Module } from '@nestjs/common'

import { BinanceModule } from '../binance/binance.module'
import { CoreModule } from '../core/core.module'
import { DatabaseModule } from '../database/database.module'
import { AlertLogController } from './alert-log/alert-log.controller'
import { AlertLogGateway } from './alert-log/alert-log.gateway'
import { AlertLogService } from './alert-log/alert-log.service'
import { SettingController } from './setting/setting.controller'
import { SettingService } from './setting/setting.service'
import { TickerController } from './ticker/ticker.controller'
import { TickerService } from './ticker/ticker.service'

@Module({
  imports: [CoreModule, DatabaseModule, BinanceModule],
  controllers: [AlertLogController, SettingController, TickerController],
  providers: [AlertLogGateway, AlertLogService, SettingService, TickerService],
  exports: [AlertLogGateway, AlertLogService, TickerService],
})
export class ClientApiModule {}

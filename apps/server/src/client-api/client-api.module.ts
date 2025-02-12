import { Module } from '@nestjs/common'

import { BinanceModule } from '../binance/binance.module'
import { CoreModule } from '../core/core.module'
import { DatabaseModule } from '../database/database.module'
import { TelegramModule } from '../telegram/telegram.module'
import { AlertLogController } from './alert-log/alert-log.controller'
import { AlertLogGateway } from './alert-log/alert-log.gateway'
import { AlertLogService } from './alert-log/alert-log.service'
import { AuthController } from './auth/auth.controller'
import { RebalanceController } from './rebalance/rebalance.controller'
import { RebalanceService } from './rebalance/rebalance.service'
import { SettingController } from './setting/setting.controller'
import { SettingService } from './setting/setting.service'
import { AutoRiskControlService } from './smart-trading/auto-risk-control.service'
import { SmartTradingController } from './smart-trading/smart-trading.controller'
import { SmartTradingService } from './smart-trading/smart-trading.service'
import { TickerPricesGateway } from './ticker/ticker-prices.gateway'
import { TickerController } from './ticker/ticker.controller'
import { TickerService } from './ticker/ticker.service'
import { VolumeDetectGateway } from './volume-detect/volume-detect.gateway'

@Module({
  imports: [CoreModule, DatabaseModule, BinanceModule, TelegramModule],
  controllers: [
    AlertLogController,
    SettingController,
    TickerController,
    RebalanceController,
    SmartTradingController,
    AuthController,
  ],
  providers: [
    AlertLogGateway,
    TickerPricesGateway,
    AlertLogService,
    SettingService,
    TickerService,
    RebalanceService,
    SmartTradingService,
    VolumeDetectGateway,
    AutoRiskControlService,
  ],
  exports: [
    AlertLogGateway,
    AlertLogService,
    TickerService,
    SmartTradingService,
    SettingService,
    RebalanceService,
  ],
})
export class ClientApiModule {}

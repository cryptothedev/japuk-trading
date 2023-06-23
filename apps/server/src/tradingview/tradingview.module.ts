import { Module } from '@nestjs/common'

import { BinanceModule } from '../binance/binance.module'
import { ClientApiModule } from '../client-api/client-api.module'
import { CoreModule } from '../core/core.module'
import { DatabaseModule } from '../database/database.module'
import { BinanceSpotTradingService } from './binance-spot-trading.service'
import { TradingviewWebhookController } from './tradingview-webhook.controller'
import { TradingviewWebhookService } from './tradingview-webhook.service'

@Module({
  imports: [CoreModule, DatabaseModule, ClientApiModule, BinanceModule],
  controllers: [TradingviewWebhookController],
  providers: [TradingviewWebhookService, BinanceSpotTradingService],
})
export class TradingviewModule {}

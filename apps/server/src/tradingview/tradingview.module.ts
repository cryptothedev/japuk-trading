import { Module } from '@nestjs/common'

import { BinanceModule } from '../binance/binance.module'
import { ClientApiModule } from '../client-api/client-api.module'
import { CoreModule } from '../core/core.module'
import { DatabaseModule } from '../database/database.module'
import { ForexModule } from '../forex/forex.module'
import { TelegramModule } from '../telegram/telegram.module'
import { TradingviewWebhookController } from './tradingview-webhook.controller'
import { TradingviewWebhookService } from './tradingview-webhook.service'

@Module({
  imports: [
    CoreModule,
    DatabaseModule,
    ClientApiModule,
    BinanceModule,
    TelegramModule,
    ForexModule,
  ],
  controllers: [TradingviewWebhookController],
  providers: [TradingviewWebhookService],
})
export class TradingviewModule {}

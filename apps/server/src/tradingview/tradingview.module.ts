import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { TradingviewWebhookController } from './tradingview-webhook.controller'

@Module({
  imports: [CoreModule],
  controllers: [TradingviewWebhookController],
})
export class TradingviewModule {}

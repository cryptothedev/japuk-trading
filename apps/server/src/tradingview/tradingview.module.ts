import { Module } from '@nestjs/common'

import { TradingviewWebhookController } from './tradingview-webhook.controller'

@Module({
  controllers: [TradingviewWebhookController],
})
export class TradingviewModule {}

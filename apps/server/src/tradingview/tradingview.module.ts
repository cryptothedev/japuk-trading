import { Module } from '@nestjs/common'

import { ClientApiModule } from '../client-api/client-api.module'
import { CoreModule } from '../core/core.module'
import { DatabaseModule } from '../database/database.module'
import { TradingviewWebhookController } from './tradingview-webhook.controller'
import { TradingviewWebhookService } from './tradingview-webhook.service'

@Module({
  imports: [CoreModule, DatabaseModule, ClientApiModule],
  controllers: [TradingviewWebhookController],
  providers: [TradingviewWebhookService],
})
export class TradingviewModule {}

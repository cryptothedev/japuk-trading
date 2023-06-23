import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { BinanceFuturesService } from './binance-futures.service'
import { BinanceSpotService } from './binance-spot.service'

@Module({
  imports: [CoreModule],
  providers: [BinanceFuturesService, BinanceSpotService],
  exports: [BinanceSpotService, BinanceFuturesService],
})
export class BinanceModule {}

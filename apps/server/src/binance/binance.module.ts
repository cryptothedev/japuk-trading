import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { BinanceFuturesService } from './binance-futures.service'
import { BinanceSpotStrategyService } from './binance-spot-strategy.service'
import { BinanceSpotService } from './binance-spot.service'

@Module({
  imports: [CoreModule],
  providers: [
    BinanceFuturesService,
    BinanceSpotService,
    BinanceSpotStrategyService,
  ],
  exports: [
    BinanceSpotService,
    BinanceFuturesService,
    BinanceSpotStrategyService,
  ],
})
export class BinanceModule {}

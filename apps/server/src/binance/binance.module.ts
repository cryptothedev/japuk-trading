import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { BinanceFuturesService } from './binance-futures.service'
import { BinanceSpotStrategyService } from './binance-spot-strategy.service'
import { BinanceSpotService } from './binance-spot.service'
import { BinanceWsService } from './binance-ws.service'

@Module({
  imports: [CoreModule],
  providers: [
    BinanceFuturesService,
    BinanceSpotService,
    BinanceSpotStrategyService,
    BinanceWsService,
  ],
  exports: [
    BinanceSpotService,
    BinanceFuturesService,
    BinanceSpotStrategyService,
    BinanceWsService,
  ],
})
export class BinanceModule {}

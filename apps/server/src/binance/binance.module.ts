import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { BinanceFuturesService } from './binance-futures.service'
import { BinanceSpotService } from './binance-spot.service'
import { BinanceWsService } from './binance-ws.service'

@Module({
  imports: [CoreModule],
  providers: [
    BinanceFuturesService,
    BinanceSpotService,
    BinanceWsService,
  ],
  exports: [
    BinanceSpotService,
    BinanceFuturesService,
    BinanceWsService,
  ],
})
export class BinanceModule {}

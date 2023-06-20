import { Module } from '@nestjs/common'

import { BinanceFuturesService } from './binance-futures.service'

@Module({
  providers: [BinanceFuturesService],
})
export class BinanceModule {}

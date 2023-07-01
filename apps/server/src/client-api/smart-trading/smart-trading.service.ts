import { TradingInfoResponse } from '@japuk/models'
import { Injectable } from '@nestjs/common'

import { BinanceFuturesService } from '../../binance/binance-futures.service'
import { BinanceSpotService } from '../../binance/binance-spot.service'

@Injectable()
export class SmartTradingService {
  constructor(
    private binanceSpotService: BinanceSpotService,
    private binanceFuturesService: BinanceFuturesService,
  ) {}
  async getTradingInfo(ticker: string): Promise<TradingInfoResponse> {
    const { highest, lowest, currentPrice } =
      await this.binanceSpotService.getHighestLowestPrice(ticker)
    const leverages = await this.binanceFuturesService.getLeverages(ticker)

    return { highest, lowest, currentPrice, leverages }
  }
}

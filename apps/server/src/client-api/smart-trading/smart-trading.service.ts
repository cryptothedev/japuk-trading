import {
  PositionSide,
  TradingCommandDto,
  TradingInfoResponse,
} from '@japuk/models'
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

  async getAutoLeverage(
    ticker: string,
    side: PositionSide,
    min: number,
    max: number,
  ) {
    return 0
  }

  async futuresTrade(tradingCommandDto: TradingCommandDto) {
    const { symbol, side } = tradingCommandDto

    await this.binanceFuturesService.setupTrade(tradingCommandDto)

    const { quantityPrecision } =
      await this.binanceFuturesService.getDecimalsInfo(symbol)
    const quantity = await this.binanceFuturesService.calculateQuantity(
      tradingCommandDto,
      quantityPrecision,
    )

    switch (side) {
      case PositionSide.LONG: {
        return this.binanceFuturesService.long(tradingCommandDto, quantity)
      }
      case PositionSide.SHORT: {
        return this.binanceFuturesService.short(tradingCommandDto, quantity)
      }
    }
  }
}

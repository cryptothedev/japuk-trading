import {
  PositionSide,
  TradingCommandDto,
  TradingInfoResponse,
} from '@japuk/models'
import { Injectable } from '@nestjs/common'

import { BinanceFuturesService } from '../../binance/binance-futures.service'
import { BinanceSpotService } from '../../binance/binance-spot.service'
import { LogService } from '../../core/log.service'

@Injectable()
export class SmartTradingService {
  constructor(
    private binanceSpotService: BinanceSpotService,
    private binanceFuturesService: BinanceFuturesService,
    private logger: LogService,
  ) {}
  async getTradingInfo(ticker: string): Promise<TradingInfoResponse> {
    const [{ highest, lowest, currentPrice }, leverages] = await Promise.all([
      this.binanceSpotService.getHighestLowestPrice(ticker),
      this.binanceFuturesService.getLeverages(ticker),
    ])

    const toHighestPercent = ((highest - currentPrice) / currentPrice) * 100
    const toLowestPercent = ((currentPrice - lowest) / currentPrice) * 100
    const toHighestLeverage = Math.floor(100 / toHighestPercent)
    const toLowestLeverage = Math.floor(100 / toLowestPercent)

    return {
      highest,
      lowest,
      currentPrice,
      leverages,
      toHighestPercent,
      toLowestPercent,
      toHighestLeverage,
      toLowestLeverage,
    }
  }

  async getAutoLeverage(
    ticker: string,
    side: PositionSide,
    min: number,
    max: number,
  ) {
    const { leverages } = await this.getTradingInfo(ticker)

    // const attemptLeverage = this.getAttemptLeverage(
    //   side,
    //   min,
    //   max,
    //   toHighestLeverage,
    //   toLowestLeverage,
    // )

    const usedLeverage = leverages.find((leverage) => max >= leverage) as number

    this.logger.info('leverages', leverages)
    this.logger.info('max leverage', max)
    this.logger.info('usedLeverage', usedLeverage)

    return usedLeverage
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

  private getAttemptLeverage(
    side: PositionSide,
    min: number,
    max: number,
    toHighestLeverage: number,
    toLowestLeverage: number,
  ) {
    let leverage = toLowestLeverage
    if (side === PositionSide.SHORT) {
      leverage = toHighestLeverage
    }

    if (leverage > max) {
      return max
    }

    if (leverage < min) {
      return min
    }

    return leverage
  }
}

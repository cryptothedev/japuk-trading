import {
  ClosePositionCommandDto,
  FuturesPositionResponse,
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

    const hasGreaterLeverage = leverages.some((leverage) => leverage > max)
    if (hasGreaterLeverage) {
      return max
    }

    const usedLeverage = leverages.find((leverage) => max >= leverage) as number

    this.logger.info('leverages', leverages)
    this.logger.info('max leverage', max)
    this.logger.info('usedLeverage', usedLeverage)

    return usedLeverage
  }

  async futuresTrade(tradingCommandDto: TradingCommandDto) {
    const { symbol, side } = tradingCommandDto

    await this.binanceFuturesService.setupTrade(tradingCommandDto)

    const { quantityPrecision, pricePrecision, tickSize } =
      await this.binanceFuturesService.getDecimalsInfo(symbol)
    const { long, short } = await this.binanceFuturesService.calculateQuantity(
      tradingCommandDto,
      quantityPrecision,
      pricePrecision,
      tickSize,
    )

    switch (side) {
      case PositionSide.LONG: {
        return this.binanceFuturesService.long(tradingCommandDto, long)
      }
      case PositionSide.SHORT: {
        return this.binanceFuturesService.short(tradingCommandDto, short)
      }
    }
  }

  async closePosition(closePositionCommandDto: ClosePositionCommandDto) {
    return this.binanceFuturesService.rawClosePosition(closePositionCommandDto)
  }

  async getCurrentPositions(): Promise<FuturesPositionResponse[]> {
    const allPositions = await this.binanceFuturesService.getAllOpenPositions()
    return allPositions.map((position) => {
      const {
        unRealizedProfit,
        leverage,
        entryPrice,
        positionAmt,
        markPrice,
        liquidationPrice,
        isolatedMargin,
        isolatedWallet,
        maxNotionalValue,
        notional,
        isAutoAddMargin,
      } = position
      return {
        ...position,
        unRealizedProfit: Number(unRealizedProfit),
        leverage: Number(leverage),
        entryPrice: Number(entryPrice),
        positionAmt: Number(positionAmt),
        markPrice: Number(markPrice),
        liquidationPrice: Number(liquidationPrice),
        isolatedMargin: Number(isolatedMargin),
        isolatedWallet: Number(isolatedWallet),
        maxNotionalValue: Number(maxNotionalValue),
        notional: Number(notional),
        isAutoAddMargin: isAutoAddMargin === 'true',
      } as FuturesPositionResponse
    })
  }
}

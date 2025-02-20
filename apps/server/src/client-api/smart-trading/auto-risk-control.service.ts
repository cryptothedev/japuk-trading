import { PositionSide } from '@japuk/models'
import { Injectable } from '@nestjs/common'
import {
  FuturesPosition,
  OrderResult,
  WsFormattedMessage,
  WsMessageMarkPriceUpdateEventFormatted,
} from 'binance'

import { BinanceFuturesService } from '../../binance/binance-futures.service'
import { BinanceWsService } from '../../binance/binance-ws.service'
import { LogService } from '../../core/log.service'
import { TelegramClientService } from '../../telegram/telegram-client.service'

@Injectable()
export class AutoRiskControlService {
  private positions: FuturesPosition[] = []
  private openOrders: OrderResult[] = []
  private inProgressDict: Record<string, boolean> = {}
  private alreadyCalled: Record<string, boolean> = {}

  constructor(
    private binanceWsService: BinanceWsService,
    private binanceFuturesService: BinanceFuturesService,
    private telegramClientService: TelegramClientService,
    private logger: LogService,
  ) {
    this.initData()

    this.binanceWsService.addListener(this.processMarkUpdateEvents)
    this.binanceWsService.addListener(this.processTradeFilledEvents)
  }

  private async initData() {
    await this.binanceFuturesService.getAllOpenPositions().then((positions) => {
      this.positions = positions
    })
    await this.binanceFuturesService.getAllOpenOrders().then((orders) => {
      this.openOrders = orders
    })
    this.logger.info('init data')

    const positionSymbols = this.positions.map((position) => position.symbol)
    Object.keys(this.alreadyCalled).forEach((symbol) => {
      if (!positionSymbols.includes(symbol)) {
        this.alreadyCalled[symbol] = false
      }
    })

    console.log(this.alreadyCalled)
  }

  private processTradeFilledEvents = async (event: WsFormattedMessage) => {
    if (Array.isArray(event)) {
      return
    }

    if (event.eventType !== 'ORDER_TRADE_UPDATE') {
      return
    }

    if (
      event.order.orderStatus === 'FILLED' ||
      event.order.orderStatus === 'CANCELED'
    ) {
      this.logger.info('update open positions')
      await this.initData()
    }
  }

  private processMarkUpdateEvents = async (event: WsFormattedMessage) => {
    if (this.positions.length === 0) {
      return
    }

    let events: WsMessageMarkPriceUpdateEventFormatted[] = []

    const isArray = Array.isArray(event)
    if (isArray && event[0].eventType === 'markPriceUpdate') {
      events = event as any
    }

    if (!isArray && event.eventType === 'markPriceUpdate') {
      events = [event] as any
    }

    if (events.length === 0) {
      return
    }

    const markPricesDict = events.reduce((dict, priceInfo) => {
      const { symbol, markPrice } = priceInfo
      dict[symbol] = markPrice
      return dict
    }, {} as Record<string, number>)

    for (const position of this.positions) {
      const { symbol, positionSide } = position
      const action = `${symbol}-${positionSide}`

      if (this.inProgressDict[action]) {
        continue
      }
      this.inProgressDict[action] = true

      try {
        const entryPrice = Number(position.entryPrice)
        const markPrice = markPricesDict[symbol]

        const percentProfit =
          positionSide === 'LONG'
            ? ((markPrice - entryPrice) / entryPrice) * 100
            : ((entryPrice - markPrice) / entryPrice) * 100

        if (!this.alreadyCalled[symbol] && percentProfit > 6) {
          this.alreadyCalled[symbol] = true
          await this.telegramClientService.callToAlert(
            `${symbol} is now ${percentProfit} %`,
          )
        }

        console.log(this.alreadyCalled)
      } catch (error) {
        console.error(error)
      } finally {
        this.inProgressDict[action] = false
      }
    }
  }

  private setStopMarket = async (
    symbol,
    orders: OrderResult[],
    side: PositionSide,
    entryPrice: number,
    trailingPercent: number,
  ) => {
    const { pricePrecision } = await this.binanceFuturesService.getDecimalsInfo(
      symbol,
    )
    const stopPrice = Number(
      (side === 'LONG'
        ? entryPrice * (1 + trailingPercent / 100)
        : entryPrice * (1 - trailingPercent / 100)
      ).toFixed(pricePrecision),
    )

    this.logger.info(
      'side',
      side,
      'entryPrice',
      entryPrice,
      'trailingPercent',
      trailingPercent,
      'stopPrice',
      stopPrice,
    )

    await this.binanceFuturesService.cancelOpenOrders(symbol, orders)
    await this.binanceFuturesService.submitStopMarket(symbol, side, stopPrice)
  }

  private getTrailingPercent = (profit: number) => {
    if (profit > 2) {
      return 2
    }
  }
}

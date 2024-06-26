import {
  ClosePositionCommandDto,
  PositionSide,
  TradingCommandDto,
} from '@japuk/models'
import { BadRequestException, Injectable } from '@nestjs/common'
import { OrderResult, USDMClient } from 'binance'

import { ConfigService } from '../core/config.service'
import { LogService } from '../core/log.service'

@Injectable()
export class BinanceFuturesService {
  private client: USDMClient

  constructor(
    private configService: ConfigService,
    private logger: LogService,
  ) {
    const { apiKey, apiSecret } = this.configService.getBinanceFuturesConfig()
    this.client = new USDMClient({ api_key: apiKey, api_secret: apiSecret })

    this.getBigPairs()
  }

  async setupTrade(command: TradingCommandDto) {
    const { symbol, leverage } = command

    const openOrders = await this.getOpenOrders(command)

    await this.cancelOpenOrders(symbol, openOrders)

    await this.client.setLeverage({
      symbol,
      leverage,
    })

    await this.client
      .setMarginType({ symbol, marginType: 'ISOLATED' })
      .catch((error) => {
        const isAlreadyIsolated =
          error.message === 'No need to change margin type.'
        if (!isAlreadyIsolated) {
          process.exit()
        }
      })

    await this.client
      .setPositionMode({ dualSidePosition: 'true' })
      .catch((error) => {
        const isAlreadyHedgeMode =
          error.message === 'No need to change position side.'
        if (!isAlreadyHedgeMode) {
          process.exit()
        }
      })
  }

  async getDecimalsInfo(symbol: string) {
    const exchangeInfo = await this.client.getExchangeInfo()
    const foundSymbolInfo = exchangeInfo.symbols.find(
      (symbolInfo) => symbolInfo.symbol === symbol,
    )

    if (!foundSymbolInfo) {
      throw new BadRequestException('symbol info is not found')
    }

    const { pricePrecision, quantityPrecision } = foundSymbolInfo
    return { pricePrecision, quantityPrecision }
  }

  async calculateQuantity(
    command: TradingCommandDto,
    quantityPrecision: number,
  ) {
    const { symbol, amountUSD, leverage } = command

    const markPrice = await this.client.getMarkPrice({
      symbol,
      isIsolated: 'TRUE',
    })

    if (Array.isArray(markPrice)) {
      throw new Error('Mark price must not be an array')
    }

    const currentPrice = Number(markPrice.markPrice)

    const longPrices = [
      currentPrice,
      currentPrice * 0.95,
      currentPrice * 0.9,
      currentPrice * 0.85,
    ]

    const shortPrices = [
      currentPrice,
      currentPrice * 1.05,
      currentPrice * 1.1,
      currentPrice * 1.15,
    ]

    return {
      long: longPrices.map((price) => {
        return {
          price,
          quantity: Number(
            ((amountUSD / currentPrice) * leverage).toFixed(quantityPrecision),
          ),
        }
      }),
      short: shortPrices.map((price) => {
        return {
          price,
          quantity: Number(
            ((amountUSD / currentPrice) * leverage).toFixed(quantityPrecision),
          ),
        }
      }),
    }
  }

  async long(
    command: TradingCommandDto,
    quantities: { quantity: number; price: number }[],
  ) {
    const { symbol } = command

    await this.client.submitNewOrder({
      symbol,
      quantity: quantities[0].quantity,
      side: 'BUY',
      positionSide: 'LONG',
      type: 'MARKET',
    })

    await this.client.submitNewOrder({
      symbol,
      quantity: quantities[1].quantity * 1.5,
      price: Number(quantities[1].price),
      side: 'BUY',
      positionSide: 'LONG',
      type: 'LIMIT',
      timeInForce: 'GTC',
    })

    await this.client.submitNewOrder({
      symbol,
      quantity: quantities[2].quantity * 2,
      price: Number(quantities[2].price),
      side: 'BUY',
      positionSide: 'LONG',
      type: 'LIMIT',
      timeInForce: 'GTC',
    })

    await this.client.submitNewOrder({
      symbol,
      quantity: quantities[3].quantity * 3,
      price: Number(quantities[3].price),
      side: 'BUY',
      positionSide: 'LONG',
      type: 'LIMIT',
      timeInForce: 'GTC',
    })
  }

  async short(
    command: TradingCommandDto,
    quantities: { quantity: number; price: number }[],
  ) {
    const { symbol } = command

    await this.client.submitNewOrder({
      symbol,
      quantity: quantities[0].quantity,
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'MARKET',
    })

    await this.client.submitNewOrder({
      symbol,
      quantity: quantities[1].quantity * 1.5,
      price: Number(quantities[1].price),
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'LIMIT',
      timeInForce: 'GTC',
    })

    await this.client.submitNewOrder({
      symbol,
      quantity: quantities[2].quantity * 2,
      price: Number(quantities[2].price),
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'LIMIT',
      timeInForce: 'GTC',
    })

    await this.client.submitNewOrder({
      symbol,
      quantity: quantities[3].quantity * 3,
      price: Number(quantities[3].price),
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'LIMIT',
      timeInForce: 'GTC',
    })
  }

  async getLeverages(symbol: string) {
    const notionalAndLeverageBrackets =
      await this.client.getNotionalAndLeverageBrackets({
        symbol,
      })

    return notionalAndLeverageBrackets
      .flatMap(
        (notionalAndLeverageBracket) => notionalAndLeverageBracket.brackets,
      )
      .map((bracket) => bracket.initialLeverage)
  }

  async getSymbolsDict() {
    const exchangeInfo = await this.client.getExchangeInfo()
    return exchangeInfo.symbols
      .map((symbol) => symbol.symbol)
      .filter((symbol) => !symbol.startsWith('1') && symbol.endsWith('USDT'))
      .reduce((dict, symbol) => {
        dict[symbol] = true
        return dict
      }, {} as Record<string, boolean>)
  }

  async cancelOpenOrders(symbol: string, positionOrders: OrderResult[]) {
    for (const order of positionOrders) {
      await this.client.cancelOrder({ symbol, orderId: order.orderId })
    }
  }

  async closePosition(symbol: string, side: PositionSide) {
    const positions = await this.client.getPositions({ symbol })
    const closingPositions = positions
      .filter((position) => position.symbol)
      .filter((position) => position.positionSide === side)

    console.log(JSON.stringify(closingPositions, null, 2))

    for (const position of closingPositions) {
      await this.client.submitNewOrder({
        symbol,
        side: side === 'LONG' ? 'SELL' : 'BUY',
        positionSide: side,
        type: 'MARKET',
        quantity: Math.abs(Number(position.positionAmt)),
      })
    }
  }

  async rawClosePosition(closePositionCommandDto: ClosePositionCommandDto) {
    const { symbol, side, amount } = closePositionCommandDto

    await this.client.submitNewOrder({
      symbol,
      side: side === 'LONG' ? 'SELL' : 'BUY',
      positionSide: side,
      type: 'MARKET',
      quantity: Math.abs(amount),
    })
  }

  submitStopMarket(symbol, side: PositionSide, stopPrice: number) {
    return this.client.submitNewOrder({
      symbol,
      side: side === 'LONG' ? 'SELL' : 'BUY',
      positionSide: side,
      type: 'STOP_MARKET',
      stopPrice,
      closePosition: 'true',
      workingType: 'MARK_PRICE',
    })
  }

  async getAllOpenPositions() {
    const allPositions = await this.client.getPositions()
    return allPositions.filter((position) => Number(position.entryPrice) !== 0)
  }

  async getAllOpenOrders() {
    return this.client.getAllOpenOrders()
  }

  private async getOpenOrders(command: TradingCommandDto) {
    const { symbol, side } = command

    const openOrders = await this.client.getAllOpenOrders({ symbol })
    return openOrders.filter((order) => order.positionSide == side)
  }

  private async getAllSymbols() {
    const exchangeInfo = await this.client.getExchangeInfo()
    return exchangeInfo.symbols
      .map((symbol) => symbol.symbol)
      .filter((symbol) => !symbol.startsWith('1') && symbol.endsWith('USDT'))
      .map((symbol) => `BINANCE:${symbol}`)
      .join(',')
  }

  private getMyBalances() {
    return this.client
      .getBalance()
      .then((balances) =>
        balances.filter((balance) => Number(balance.balance) > 0),
      )
  }

  private async getBigPairs() {
    const symbols = await this.client.getNotionalAndLeverageBrackets()

    const bigSymbols = symbols
      .filter((symbol) =>
        symbol.brackets.some((bracket) => {
          const bigPairCondition =
            (bracket.initialLeverage === 20 &&
              bracket.notionalCap >= 150_000) ||
            (bracket.initialLeverage === 25 && bracket.notionalCap >= 250_000)
          const notIncludeBTCETH =
            !symbol.symbol.includes('ETH') && !symbol.symbol.includes('BTC')

          return bigPairCondition && notIncludeBTCETH
        }),
      )
      .map((symbol) => {
        return 'BINANCE:' + symbol.symbol
      })
      .join(',')

    console.log(bigSymbols)
  }
}

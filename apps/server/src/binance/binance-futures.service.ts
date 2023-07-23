import { PositionSide, TradingCommandDto } from '@japuk/models'
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
  }

  async setupTrade(command: TradingCommandDto) {
    const { symbol, leverage } = command

    const openOrders = await this.getOpenOrders(command)

    await this.cancelOpenOrders(command, openOrders)

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

    const quantity = ((amountUSD / currentPrice) * leverage).toFixed(
      quantityPrecision,
    )

    return Number(quantity)
  }

  async long(command: TradingCommandDto, quantity: number) {
    const { symbol } = command

    await this.client.submitNewOrder({
      symbol,
      quantity,
      side: 'BUY',
      positionSide: 'LONG',
      type: 'MARKET',
    })
  }

  async short(command: TradingCommandDto, quantity: number) {
    const { symbol } = command

    await this.client.submitNewOrder({
      symbol,
      quantity: quantity,
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'MARKET',
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

  private async getOpenOrders(command: TradingCommandDto) {
    const { symbol, side } = command

    const openOrders = await this.client.getAllOpenOrders({ symbol })
    return openOrders.filter((order) => order.positionSide == side)
  }

  private async cancelOpenOrders(
    command: TradingCommandDto,
    positionOrders: OrderResult[],
  ) {
    const { symbol } = command
    for (const order of positionOrders) {
      await this.client.cancelOrder({ symbol, orderId: order.orderId })
    }
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
}

import { Injectable } from '@nestjs/common'
import { MainClient } from 'binance'
import { SymbolLotSizeFilter } from 'binance/lib/types/shared'

import { ConfigService } from '../core/config.service'

@Injectable()
export class BinanceSpotService {
  private client: MainClient

  constructor(private configService: ConfigService) {
    const { apiKey, apiSecret } = this.configService.getBinanceSpotConfig()
    this.client = new MainClient({ api_key: apiKey, api_secret: apiSecret })
  }

  buyUSDAmount(symbol: string, amountUSD: number) {
    return this.client.submitNewOrder({
      symbol,
      side: 'BUY',
      type: 'MARKET',
      quoteOrderQty: amountUSD,
    })
  }

  sellUSDAmount(symbol: string, amountUSD: number) {
    return this.client.submitNewOrder({
      symbol,
      side: 'SELL',
      type: 'MARKET',
      quoteOrderQty: amountUSD,
    })
  }

  buyQuantity(symbol: string, amount: number) {
    return this.client.submitNewOrder({
      symbol,
      side: 'BUY',
      type: 'MARKET',
      quantity: amount,
    })
  }

  sellQuantity(symbol: string, amount: number) {
    return this.client.submitNewOrder({
      symbol,
      side: 'SELL',
      type: 'MARKET',
      quantity: amount,
    })
  }

  getMyBalances() {
    return this.client
      .getBalances()
      .then((balances) =>
        balances.filter((balance) => Number(balance.free) > 0),
      )
  }

  getMyBalancesDict() {
    return this.getMyBalances().then((balances) =>
      balances.reduce((dict, balance) => {
        dict[`${balance.coin.toUpperCase()}`] = Number(balance.free)
        return dict
      }, {} as Record<string, number>),
    )
  }

  getPricesDict() {
    return this.client.getSymbolPriceTicker().then((pairs) => {
      if (!Array.isArray(pairs)) {
        return {}
      }

      return pairs
        .filter(
          ({ symbol }) => symbol.includes('USDT') || symbol.includes('BUSD'),
        )
        .reduce((dict, pair) => {
          const { symbol, price } = pair
          dict[symbol.toUpperCase()] = Number(price)
          return dict
        }, {} as Record<string, number>)
    })
  }

  async getQuantityPrecisionDict() {
    const { symbols, exchangeFilters } = await this.client.getExchangeInfo()

    return symbols.reduce((dict, symbol) => {
      const { filters, symbol: symbolName } = symbol

      const lotSize = filters.find(
        (filter) => filter.filterType === 'LOT_SIZE',
      ) as SymbolLotSizeFilter

      if (lotSize) {
        dict[symbolName] =
          String(lotSize.minQty)
            .split('.')[1]
            .split('')
            .findIndex((i) => i !== '0') + 1
      }

      return dict
    }, {} as Record<string, number>)
  }

  getHighestLowestPrice(symbol: string) {
    return this.client
      .getKlines({ symbol, interval: '1d', limit: 2 })
      .then((kLines) => {
        return kLines.map((kLine) => {
          return {
            open: Number(kLine[1]),
            high: Number(kLine[2]),
            low: Number(kLine[3]),
            close: Number(kLine[4]),
          }
        })
      })
      .then((prices) => {
        return {
          highest: Math.max(...prices.map((price) => price.high)),
          lowest: Math.min(...prices.map((price) => price.low)),
          currentPrice: prices[prices.length - 1].close,
        }
      })
  }
}

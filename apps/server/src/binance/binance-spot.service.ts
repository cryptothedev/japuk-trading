import { Injectable } from '@nestjs/common'
import { MainClient } from 'binance'

import { ConfigService } from '../core/config.service'

export interface Product {
  symbol: string
  circulatingSupply: number
  marketCap: number
  price: number
}

@Injectable()
export class BinanceSpotService {
  private client: MainClient

  constructor(private configService: ConfigService) {
    const { apiKey, apiSecret } = this.configService.getBinanceSpotConfig()
    this.client = new MainClient({ api_key: apiKey, api_secret: apiSecret })
  }

  buy(symbol: string, amountUSD: number) {
    return this.client.submitNewOrder({
      symbol,
      side: 'BUY',
      type: 'MARKET',
      quoteOrderQty: amountUSD,
    })
  }

  sell(symbol: string, amountUSD: number) {
    return this.client.submitNewOrder({
      symbol,
      side: 'SELL',
      type: 'MARKET',
      quoteOrderQty: amountUSD,
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

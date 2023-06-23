import { Injectable } from '@nestjs/common'

import { BinanceSpotService } from '../binance/binance-spot.service'
import { LogService } from '../core/log.service'
import { wait } from '../utils/wait'
import { removeStable } from './utils/removeStable'

@Injectable()
export class BinanceSpotTradingService {
  constructor(
    private binanceSpotService: BinanceSpotService,
    private log: LogService,
  ) {}

  async dca(amountUSD: number, pairs: string[]) {
    for (const pair of pairs) {
      await this.binanceSpotService.buy(pair, amountUSD)
      this.log.info(`dca ${pair} amount ${amountUSD}`)
      await wait(1)
    }
  }

  async sellDCA(percentTp: number, pairs: string[]) {
    const balancesDict = await this.binanceSpotService.getMyBalancesDict()
    const pricesDict = await this.binanceSpotService.getPricesDict()

    for (const pair of pairs) {
      try {
        const currentPrice = pricesDict[pair]

        const pairCoin = removeStable(pair)
        const currentAmount = balancesDict[pairCoin]

        if (!currentPrice || !currentAmount) {
          this.log.info('skipped', pair)
          continue
        }

        const amountUSD = Math.floor(
          (currentPrice * currentAmount * percentTp) / 100,
        )
        this.log.info('selling amount', amountUSD)

        await this.binanceSpotService.sell(pair, amountUSD)
        this.log.info(`dca sell ${pair} amount ${amountUSD}`)
      } catch (e) {
        this.log.error('failed to dca sell', pair, e)
      } finally {
        await wait(1)
      }
    }
  }

  async rebalance(rebalanceToUSD: number, pairs: string[], alsoBuy: boolean) {
    const balancesDict = await this.binanceSpotService.getMyBalancesDict()
    const pricesDict = await this.binanceSpotService.getPricesDict()

    for (const pair of pairs) {
      try {
        const currentPrice = pricesDict[pair]

        const pairCoin = removeStable(pair)
        const currentAmount = balancesDict[pairCoin]

        if (!currentPrice || !currentAmount) {
          this.log.info('skipped', pair)
          continue
        }

        const marketValueUSD = currentPrice * currentAmount
        const amount = Math.floor(marketValueUSD - rebalanceToUSD)
        const buy = amount < 0
        const sell = !buy
        if (buy && !alsoBuy) {
          this.log.info(
            'skipped. does not need to do anything',
            pair,
            amount,
            alsoBuy,
          )
          continue
        } else if (buy) {
          const buyAmount = amount * -1
          this.log.info('buying amount', buyAmount)
          await this.binanceSpotService.buy(pair, buyAmount)
        } else if (sell) {
          this.log.info('selling amount', amount)
          await this.binanceSpotService.sell(pair, amount)
        }
        this.log.info('rebalance', pair, amount)
      } catch (e) {
        this.log.error('failed to rebalance', pair, e)
      } finally {
        await wait(1)
      }
    }
  }
}

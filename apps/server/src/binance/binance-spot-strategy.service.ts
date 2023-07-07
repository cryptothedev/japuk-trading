import { Injectable } from '@nestjs/common'
import { chunk } from 'lodash'

import { LogService } from '../core/log.service'
import { removeStable } from '../tradingview/utils/removeStable'
import { wait } from '../utils/wait'
import { BinanceSpotService } from './binance-spot.service'

@Injectable()
export class BinanceSpotStrategyService {
  constructor(
    private binanceSpotService: BinanceSpotService,
    private logger: LogService,
  ) {}

  async dca(amountUSD: number, pairs: string[]) {
    for (const pair of pairs) {
      await this.binanceSpotService.buy(pair, amountUSD)
      this.logger.info(`dca ${pair} amount ${amountUSD}`)
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
          this.logger.info('skipped', pair)
          continue
        }

        const amountUSD = Math.floor(
          (currentPrice * currentAmount * percentTp) / 100,
        )
        this.logger.info('selling amount', amountUSD)

        await this.binanceSpotService.sell(pair, amountUSD)
        this.logger.info(`dca sell ${pair} amount ${amountUSD}`)
      } catch (e) {
        this.logger.error('failed to dca sell', pair, e)
      } finally {
        await wait(1)
      }
    }
  }

  async rebalance(rebalanceToUSD: number, pairs: string[], alsoBuy: boolean) {
    const balancesDict = await this.binanceSpotService.getMyBalancesDict()
    const pricesDict = await this.binanceSpotService.getPricesDict()

    const pairsChunks = chunk(pairs, 5)
    for (const pairs of pairsChunks) {
      await Promise.all(
        pairs.map((pair) =>
          this.rebalancePair(
            rebalanceToUSD,
            pair,
            alsoBuy,
            balancesDict,
            pricesDict,
          ),
        ),
      )
    }
  }

  async rebalancePair(
    rebalanceToUSD: number,
    pair: string,
    alsoBuy: boolean,
    balancesDict: Record<string, number>,
    pricesDict: Record<string, number>,
  ) {
    try {
      const currentPrice = pricesDict[pair]

      const pairCoin = removeStable(pair)
      const currentAmount = balancesDict[pairCoin]

      if (!currentPrice || !currentAmount) {
        this.logger.info('skipped', pair)
        return
      }

      this.logger.info('currentPrice', currentPrice)
      this.logger.info('currentAmount', currentAmount)

      const marketValueUSD = currentPrice * currentAmount
      const amount = Math.floor(marketValueUSD - rebalanceToUSD)
      const buy = amount < 0
      const sell = !buy
      if (buy && !alsoBuy) {
        this.logger.info(
          'skipped. does not need to do anything',
          pair,
          amount,
          alsoBuy,
        )
        return
      } else if (buy) {
        const buyAmount = amount * -1
        this.logger.info('buying amount', buyAmount)
        await this.binanceSpotService.buy(pair, buyAmount)
      } else if (sell) {
        this.logger.info('selling amount', amount)
        await this.binanceSpotService.sell(pair, amount)
      }
      this.logger.info('rebalance', pair, amount)
    } catch (e) {
      this.logger.error('failed to rebalance', pair, e)
    } finally {
      await wait(0.1)
    }
  }
}

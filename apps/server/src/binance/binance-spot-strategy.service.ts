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

  async rebalance(rebalanceToUSD: number, pairs: string[], alsoBuy: boolean) {
    const balancesDict = await this.binanceSpotService.getMyBalancesDict()
    const pricesDict = await this.binanceSpotService.getPricesDict()
    const quantityPrecisionDict =
      await this.binanceSpotService.getQuantityPrecisionDict()

    const size = Math.ceil(pairs.length / 2)
    const pairsChunks = chunk(pairs, size)
    for (const pairs of pairsChunks) {
      await Promise.all(
        pairs.map((pair) =>
          this.rebalancePair(
            rebalanceToUSD,
            pair,
            alsoBuy,
            balancesDict,
            pricesDict,
            quantityPrecisionDict,
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
    quantityPrecisionDict: Record<string, number>,
  ) {
    try {
      const currentPrice = pricesDict[pair]
      const quantityPrecision = quantityPrecisionDict[pair]

      const pairCoin = removeStable(pair)
      const currentAmount = balancesDict[pairCoin] ?? 0

      if (
        currentPrice === undefined ||
        currentAmount === undefined ||
        quantityPrecision === undefined
      ) {
        this.logger.info(pairCoin, 'skipped', pair)
        return
      }

      this.logger.info(pairCoin, 'currentPrice', currentPrice)
      this.logger.info(pairCoin, 'currentAmount', currentAmount)

      const marketValueUSD = currentPrice * currentAmount
      const quantity = Number(
        ((marketValueUSD - rebalanceToUSD) / currentPrice).toFixed(
          quantityPrecision,
        ),
      )

      const buy = quantity < 0
      const sell = !buy
      if (buy && !alsoBuy) {
        this.logger.info(
          'skipped. does not need to do anything',
          pair,
          quantity,
          alsoBuy,
        )
        return
      } else if (buy) {
        const buyQuantity = quantity * -1
        this.logger.info(pairCoin, 'buying quantity', buyQuantity)
        await this.binanceSpotService.buyQuantity(pair, buyQuantity)
      } else if (sell) {
        this.logger.info(pairCoin, 'selling quantity', quantity)
        await this.binanceSpotService.sellQuantity(pair, quantity)
      }
      this.logger.info(pairCoin, 'rebalance', pair, quantity)
    } catch (e) {
      this.logger.error('failed to rebalance', pair, e)
    } finally {
      await wait(0.01)
    }
  }
}

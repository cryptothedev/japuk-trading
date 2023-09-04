import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { chunk } from 'lodash'

import { BinanceSpotService } from '../../binance/binance-spot.service'
import { LogService } from '../../core/log.service'
import { TickerDocument } from '../../database/ticker/ticker.schema'
import { removeStable } from '../../tradingview/utils/removeStable'
import { wait } from '../../utils/wait'
import { SettingService } from '../setting/setting.service'
import { TickerService } from '../ticker/ticker.service'

@Injectable()
export class RebalanceService {
  constructor(
    private binanceSpotService: BinanceSpotService,
    private tickerService: TickerService,
    private settingService: SettingService,
    private logger: LogService,
  ) {}
  async rebalanceAll() {
    const setting = await this.settingService.getOne()
    if (!setting) {
      this.logger.info('cannot rebalance setting is not found')
      throw new InternalServerErrorException()
    }
    this.logger.info('setting', setting)
    const tickers = await this.tickerService.getTickers()
    await this.rebalance(setting.rebalanceToUSD, tickers, true)
  }

  async rebalanceOne(id: string) {
    const setting = await this.settingService.getOne()
    if (!setting) {
      this.logger.info('cannot rebalance setting is not found')
      throw new InternalServerErrorException()
    }

    const pair = await this.tickerService.getPairById(id)
    this.logger.info('setting', setting)
    this.logger.info('pair', pair)

    const [balancesDict, pricesDict, quantityPrecisionDict] = await Promise.all(
      [
        this.binanceSpotService.getMyBalancesDict(),
        this.binanceSpotService.getPricesDict(),
        this.binanceSpotService.getQuantityPrecisionDict(),
      ],
    )

    await this.rebalancePair(
      setting.rebalanceToUSD,
      pair,
      true,
      balancesDict,
      pricesDict,
      quantityPrecisionDict,
    )
  }

  async rebalance(
    rebalanceToUSD: number,
    tickers: TickerDocument[],
    alsoBuy: boolean,
  ) {
    const [balancesDict, pricesDict, quantityPrecisionDict] = await Promise.all(
      [
        this.binanceSpotService.getMyBalancesDict(),
        this.binanceSpotService.getPricesDict(),
        this.binanceSpotService.getQuantityPrecisionDict(),
      ],
    )
    const size = Math.ceil(tickers.length / 2)
    const tickersChunk = chunk(tickers, size)
    for (const tickers of tickersChunk) {
      await Promise.all(
        tickers
          .filter((ticker) => !ticker.isDisabled)
          .map((ticker) =>
            this.rebalancePair(
              rebalanceToUSD,
              ticker.pair,
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
      const gain = marketValueUSD - rebalanceToUSD
      const quantity = Number((gain / currentPrice).toFixed(quantityPrecision))

      if (quantity === 0) {
        this.logger.info(pair, 'skipped. quantity === 0', quantity, alsoBuy)
        return
      }

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
      await this.tickerService.pushGain(pair, gain)
    } catch (e) {
      this.logger.error('failed to rebalance', pair, e)
    } finally {
      await wait(0.01)
    }
  }
}

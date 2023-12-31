import { TickerResponse, UpsertTickersDto } from '@japuk/models'
import { BadRequestException, Injectable } from '@nestjs/common'

import { BinanceSpotService } from '../../binance/binance-spot.service'
import { LogService } from '../../core/log.service'
import { TickerRepo } from '../../database/ticker/ticker.repo'
import { TickerDocument } from '../../database/ticker/ticker.schema'
import { removeStable } from '../../tradingview/utils/removeStable'

@Injectable()
export class TickerService {
  constructor(
    private tickerRepo: TickerRepo,
    private logger: LogService,
    private binanceSpotService: BinanceSpotService,
  ) {}
  async get() {
    const [tickers, myBalancesDict, pricesDict] = await Promise.all([
      this.tickerRepo.find(),
      this.binanceSpotService.getMyBalancesDict(),
      this.binanceSpotService.getPricesDict(),
    ])
    return tickers.map((ticker) =>
      this.toTickerResponse(ticker, myBalancesDict, pricesDict),
    )
  }

  async getTickers() {
    return this.tickerRepo.find()
  }

  async upsert(upsertTickerDto: UpsertTickersDto) {
    const { pairs } = upsertTickerDto
    const upserteds: TickerDocument[] = []
    for (const pair of pairs) {
      upserteds.push(await this.tickerRepo.upsert(pair))
    }
    const myBalancesDict = await this.binanceSpotService.getMyBalancesDict()
    const pricesDict = await this.binanceSpotService.getPricesDict()
    return upserteds.map((upserted) =>
      this.toTickerResponse(upserted, myBalancesDict, pricesDict),
    )
  }

  async delete(id: string) {
    const deleted = await this.tickerRepo.delete(id)
    if (!deleted) {
      this.logger.error('failed to delete ticker the id does not exist', {
        id,
      })
      throw new BadRequestException()
    }
    return id
  }

  async toggle(id: string) {
    const toggled = await this.tickerRepo.toggle(id)
    const myBalancesDict = await this.binanceSpotService.getMyBalancesDict()
    const pricesDict = await this.binanceSpotService.getPricesDict()
    if (!toggled) {
      this.logger.error('failed to toggle ticker the id does not exist', {
        id,
      })
      throw new BadRequestException()
    }
    return this.toTickerResponse(toggled, myBalancesDict, pricesDict)
  }

  async getPairById(id: string) {
    const found = await this.tickerRepo.findById(id)
    if (!found) {
      this.logger.error('failed to find ticker', {
        id,
      })
      throw new BadRequestException()
    }
    return found.pair
  }

  toTickerResponse(
    tickerDoc: TickerDocument,
    myBalancesDict: Record<string, number>,
    pricesDict: Record<string, number>,
  ): TickerResponse {
    const { _id, pair, isDisabled, gains } = tickerDoc
    const coin = removeStable(pair)
    const currentPrice = pricesDict[pair] ?? 0
    const currentAmount = myBalancesDict[coin] ?? 0

    return {
      id: _id.toString(),
      pair,
      price: currentPrice,
      amount: currentAmount,
      value: currentPrice * currentAmount,
      isDisabled,
      gains,
    }
  }

  async pushGain(pair: string, gain: number) {
    return this.tickerRepo.pushGain(pair, gain)
  }
}

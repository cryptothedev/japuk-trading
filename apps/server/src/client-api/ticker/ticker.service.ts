import { TickerResponse, UpsertTickerDto } from '@japuk/models'
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
    const tickers = await this.tickerRepo.find()
    const myBalancesDict = await this.binanceSpotService.getMyBalancesDict()
    const pricesDict = await this.binanceSpotService.getPricesDict()
    return tickers.map((ticker) =>
      this.toTickerResponse(ticker, myBalancesDict, pricesDict),
    )
  }

  async upsert(upsertTickerDto: UpsertTickerDto) {
    const upserted = await this.tickerRepo.upsert(upsertTickerDto)
    const myBalancesDict = await this.binanceSpotService.getMyBalancesDict()
    const pricesDict = await this.binanceSpotService.getPricesDict()
    return this.toTickerResponse(upserted, myBalancesDict, pricesDict)
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

  toTickerResponse(
    tickerDoc: TickerDocument,
    myBalancesDict: Record<string, number>,
    pricesDict: Record<string, number>,
  ): TickerResponse {
    const { _id, pair } = tickerDoc
    const coin = removeStable(pair)
    const currentPrice = pricesDict[pair]
    const currentAmount = myBalancesDict[coin]

    return {
      id: _id.toString(),
      pair,
      price: currentPrice,
      amount: currentAmount,
      value: currentPrice * currentAmount,
    }
  }
}

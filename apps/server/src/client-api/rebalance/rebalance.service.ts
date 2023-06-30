import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { BinanceSpotStrategyService } from '../../binance/binance-spot-strategy.service'
import { BinanceSpotService } from '../../binance/binance-spot.service'
import { LogService } from '../../core/log.service'
import { SettingService } from '../setting/setting.service'
import { TickerService } from '../ticker/ticker.service'

@Injectable()
export class RebalanceService {
  constructor(
    private binanceSpotStrategyService: BinanceSpotStrategyService,
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
    const pairs = await this.tickerService.getPairs()
    this.logger.info('pairs', pairs)
    await this.binanceSpotStrategyService.rebalance(
      setting.rebalanceToUSD,
      pairs,
      true,
    )
  }

  async rebalanceOne(pair: string) {
    const setting = await this.settingService.getOne()
    if (!setting) {
      this.logger.info('cannot rebalance setting is not found')
      throw new InternalServerErrorException()
    }
    this.logger.info('setting', setting)
    this.logger.info('pair', pair)

    const balancesDict = await this.binanceSpotService.getMyBalancesDict()
    const pricesDict = await this.binanceSpotService.getPricesDict()

    await this.binanceSpotStrategyService.rebalancePair(
      setting.rebalanceToUSD,
      pair,
      true,
      balancesDict,
      pricesDict,
    )
  }
}

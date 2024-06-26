import { PositionSide, SettingResponse, TradingCommandDto } from '@japuk/models'
import { Injectable } from '@nestjs/common'

import { BinanceFuturesService } from '../binance/binance-futures.service'
import { BinanceSpotService } from '../binance/binance-spot.service'
import { AlertLogGateway } from '../client-api/alert-log/alert-log.gateway'
import { AlertLogService } from '../client-api/alert-log/alert-log.service'
import { RebalanceService } from '../client-api/rebalance/rebalance.service'
import { SmartTradingService } from '../client-api/smart-trading/smart-trading.service'
import { ConfigService } from '../core/config.service'
import { LogService } from '../core/log.service'
import { AlertLogRepo } from '../database/alert-log/alert-log.repo'
import { TickerDocument } from '../database/ticker/ticker.schema'
import { TelegramBotService } from '../telegram/telegram-bot.service'
import { TelegramClientService } from '../telegram/telegram-client.service'
import { wait } from '../utils/wait'

const indicatorRebalanceDict: Record<
  string,
  { lastRun: Date; lastPrice: number }
> = {}

@Injectable()
export class TradingviewWebhookService {
  constructor(
    private alertLogRepo: AlertLogRepo,
    private alertLogGateway: AlertLogGateway,
    private alertLogService: AlertLogService,
    private telegramClientService: TelegramClientService,
    private telegramBotService: TelegramBotService,
    private configService: ConfigService,
    private binanceSpotService: BinanceSpotService,
    private binanceFuturesService: BinanceFuturesService,
    private smartTradingService: SmartTradingService,
    private rebalanceService: RebalanceService,
    private logger: LogService,
  ) {}

  async processAlertWithMessage(actionBody: string) {
    const [message, dontSend] = actionBody.split('_')
    const annId = this.configService.getNukZingAnnId()

    await this.telegramClientService.callToAlert(`alert: ${message}`)

    if (!dontSend) {
      await this.telegramBotService.sendMessage(message, annId)
    }
  }

  async processAlert(actionBody: string) {
    const [coin, price, reason] = actionBody.split(':')

    const alertLogDoc = await this.alertLogRepo.create({
      coin,
      price,
      reason,
    })

    await this.telegramClientService.callToAlert(
      `${coin} price: ${price}
reason: ${reason}`,
    )

    await this.alertLogGateway.newAlertLog(
      this.alertLogService.toAlertLogResponse(alertLogDoc),
    )
  }

  async rebalanceTo(
    actionBody: string,
    setting: SettingResponse,
    tickers: TickerDocument[],
  ) {
    const rebalanceToUSDFromRequest = actionBody
    const { rebalanceToUSD: rebalanceToUSDFromSetting } = setting

    const rebalanceToUSD = rebalanceToUSDFromRequest
      ? Number(rebalanceToUSDFromRequest)
      : rebalanceToUSDFromSetting
    await this.rebalanceService.rebalance(rebalanceToUSD, tickers, true)
  }

  async rebalancePair(actionBody: string, setting: SettingResponse) {
    const { rebalanceToUSD: rebalanceToUSDFromSetting } = setting
    const [pair, rebalanceToUSDFromRequest] = actionBody.split('_')
    const rebalanceToUSD = rebalanceToUSDFromRequest
      ? Number(rebalanceToUSDFromRequest)
      : rebalanceToUSDFromSetting

    const [balancesDict, pricesDict, quantityPrecisionDict] = await Promise.all(
      [
        this.binanceSpotService.getMyBalancesDict(),
        this.binanceSpotService.getPricesDict(),
        this.binanceSpotService.getQuantityPrecisionDict(),
      ],
    )

    await this.rebalanceService.rebalancePair(
      rebalanceToUSD,
      pair,
      true,
      balancesDict,
      pricesDict,
      quantityPrecisionDict,
    )
  }

  async indicatorRebalancePair(actionBody: string, setting: SettingResponse) {
    const { rebalanceToUSD } = setting
    const [pair, currentPriceFromRequest] = actionBody.split('_')
    const currentPrice = Number(currentPriceFromRequest)

    indicatorRebalanceDict[pair] = {
      lastRun: new Date(),
      lastPrice: currentPrice,
    }

    this.logger.info(indicatorRebalanceDict[pair])

    const [balancesDict, pricesDict, quantityPrecisionDict] = await Promise.all(
      [
        this.binanceSpotService.getMyBalancesDict(),
        this.binanceSpotService.getPricesDict(),
        this.binanceSpotService.getQuantityPrecisionDict(),
      ],
    )

    await this.rebalanceService.rebalancePair(
      rebalanceToUSD,
      pair,
      true,
      balancesDict,
      pricesDict,
      quantityPrecisionDict,
    )
  }

  async smartFuturesTrade(
    actionBody: string,
    side: PositionSide,
    setting: SettingResponse,
  ) {
    const [ticker, amountUsd] = actionBody.split('_')
    const { maxLeverage, futuresAmountUSD: amountUsdFromSetting } = setting
    const leverage = await this.smartTradingService.getAutoLeverage(
      ticker,
      side,
      0,
      maxLeverage,
    )
    const dto: TradingCommandDto = {
      symbol: ticker,
      side,
      amountUSD: amountUsd ? Number(amountUsd) : amountUsdFromSetting,
      leverage,
    }

    await wait(5)

    await this.smartTradingService.futuresTrade(dto)
  }

  async closeFuturesPosition(actionBody: string, side: PositionSide) {
    const ticker = actionBody
    await this.binanceFuturesService.closePosition(ticker, side)
  }
}

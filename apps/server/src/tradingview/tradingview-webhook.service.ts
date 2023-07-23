import { PositionSide, SettingResponse, TradingCommandDto } from '@japuk/models'
import { Injectable } from '@nestjs/common'

import { BinanceFuturesService } from '../binance/binance-futures.service'
import { BinanceSpotStrategyService } from '../binance/binance-spot-strategy.service'
import { BinanceSpotService } from '../binance/binance-spot.service'
import { AlertLogGateway } from '../client-api/alert-log/alert-log.gateway'
import { AlertLogService } from '../client-api/alert-log/alert-log.service'
import { SmartTradingService } from '../client-api/smart-trading/smart-trading.service'
import { ConfigService } from '../core/config.service'
import { AlertLogRepo } from '../database/alert-log/alert-log.repo'
import { TelegramBotService } from '../telegram/telegram-bot.service'
import { TelegramClientService } from '../telegram/telegram-client.service'

@Injectable()
export class TradingviewWebhookService {
  constructor(
    private alertLogRepo: AlertLogRepo,
    private alertLogGateway: AlertLogGateway,
    private alertLogService: AlertLogService,
    private telegramClientService: TelegramClientService,
    private telegramBotService: TelegramBotService,
    private configService: ConfigService,
    private binanceSpotStrategyService: BinanceSpotStrategyService,
    private binanceSpotService: BinanceSpotService,
    private binanceFuturesService: BinanceFuturesService,
    private smartTradingService: SmartTradingService,
  ) {}
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

    const { chatId, threadId } =
      this.configService.getNukZingBotTradeAlertThreadConfig()

    await this.telegramBotService.sendMessage(
      `<b>${coin}</b> price: <b>${price}</b>
reason: <b>${reason}</b>`,
      chatId,
      threadId,
    )

    await this.alertLogGateway.newAlertLog(
      this.alertLogService.toAlertLogResponse(alertLogDoc),
    )
  }

  async rebalanceTo(
    actionBody: string,
    setting: SettingResponse,
    pairs: string[],
  ) {
    const rebalanceToUSDFromRequest = actionBody
    const { rebalanceToUSD: rebalanceToUSDFromSetting } = setting

    const rebalanceToUSD = rebalanceToUSDFromRequest
      ? Number(rebalanceToUSDFromRequest)
      : rebalanceToUSDFromSetting
    await this.binanceSpotStrategyService.rebalance(rebalanceToUSD, pairs, true)
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

    await this.binanceSpotStrategyService.rebalancePair(
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
    const ticker = actionBody
    const { maxLeverage, futuresAmountUSD } = setting
    const leverage = await this.smartTradingService.getAutoLeverage(
      ticker,
      side,
      0,
      maxLeverage,
    )
    const dto: TradingCommandDto = {
      symbol: ticker,
      side,
      amountUSD: futuresAmountUSD,
      leverage,
    }

    await this.smartTradingService.futuresTrade(dto)
  }

  async closeFuturesPosition(actionBody: string, side: PositionSide) {
    const ticker = actionBody
    await this.binanceFuturesService.closePosition(ticker, side)
  }
}

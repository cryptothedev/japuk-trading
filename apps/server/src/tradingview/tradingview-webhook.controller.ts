import { PositionSide, TradingCommandDto } from '@japuk/models'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { Request } from 'express'
import * as requestIp from 'request-ip'

import { BinanceSpotStrategyService } from '../binance/binance-spot-strategy.service'
import { BinanceSpotService } from '../binance/binance-spot.service'
import { SettingService } from '../client-api/setting/setting.service'
import { SmartTradingService } from '../client-api/smart-trading/smart-trading.service'
import { TickerService } from '../client-api/ticker/ticker.service'
import { ConfigService } from '../core/config.service'
import { LogService } from '../core/log.service'
import { wait } from '../utils/wait'
import { WebhookAction } from './models/WebhookAction'
import { TradingviewWebhookService } from './tradingview-webhook.service'
import { getWebhookAction } from './utils/getWebhookAction'

const TRADINGVIEW_IPS = [
  '52.89.214.238',
  '34.212.75.30',
  '54.218.53.128',
  '52.32.178.7',
]

@Controller('tradingview-webhook')
export class TradingviewWebhookController {
  private messagesInProgressDict: Record<string, boolean> = {}

  constructor(
    private configService: ConfigService,
    private tradingviewWebhookService: TradingviewWebhookService,
    private binanceSpotTradingService: BinanceSpotStrategyService,
    private binanceSpotService: BinanceSpotService,
    private smartTradingService: SmartTradingService,
    private tickerService: TickerService,
    private settingService: SettingService,
    private logger: LogService,
  ) {}

  @Post(':token')
  async webhookFromTradingview(
    @Param('token') token: string,
    @Body() rawMessage: string,
    @Req() request: Request,
  ) {
    const senderIp: string = requestIp.getClientIp(request)
    const validIp = TRADINGVIEW_IPS.some((tradingviewIp) =>
      senderIp.includes(tradingviewIp),
    )
    if (!validIp) {
      throw new BadRequestException(senderIp)
    }

    if (token !== this.configService.getTradingViewToken()) {
      this.logger.error('token is invalid', token)
      throw new ForbiddenException()
    }

    const setting = await this.settingService.getOne()
    if (!setting) {
      this.logger.error(
        'cannot process, please go to setup your setting',
        token,
      )
      throw new InternalServerErrorException()
    }

    this.logger.info('processing webhook from tradingview', rawMessage)
    const pairs = await this.tickerService.getPairs()
    const {
      rebalanceToUSD: rebalanceToUSDFromSetting,
      futuresAmountUSD: futuresAmountUSDFromSetting,
      maxLeverage: maxLeverageFromSetting,
    } = setting

    const messages = rawMessage.split('\n').filter(Boolean)
    for (const message of messages) {
      try {
        if (this.messagesInProgressDict[message]) {
          this.logger.info(
            'message in progress',
            this.messagesInProgressDict,
            message,
          )
          continue
        }
        this.messagesInProgressDict[message] = true

        const webhookAction = getWebhookAction(message)
        const actionBody = message.split('_').slice(1).join('_')

        switch (webhookAction) {
          case WebhookAction.Alert: {
            await this.tradingviewWebhookService.processWebhookFromTradingview(
              actionBody,
            )
            break
          }

          // SPOT
          case WebhookAction.RebalanceTo: {
            const rebalanceToUSDFromRequest = actionBody
            const rebalanceToUSD = rebalanceToUSDFromRequest
              ? Number(rebalanceToUSDFromRequest)
              : rebalanceToUSDFromSetting
            // await this.binanceSpotTradingService.rebalance(
            //   rebalanceToUSD,
            //   pairs,
            //   true,
            // )
            console.log('rebalanceToUSD', rebalanceToUSD)
            break
          }
          case WebhookAction.Rebalance: {
            const [pair, rebalanceToUSDFromRequest] = actionBody.split('_')
            const rebalanceToUSD = rebalanceToUSDFromRequest
              ? Number(rebalanceToUSDFromRequest)
              : rebalanceToUSDFromSetting
            const balancesDict =
              await this.binanceSpotService.getMyBalancesDict()
            const pricesDict = await this.binanceSpotService.getPricesDict()
            console.log('rebalanceToUSD', rebalanceToUSD)
            // await this.binanceSpotTradingService.rebalancePair(
            //   rebalanceToUSD,
            //   pair,
            //   true,
            //   balancesDict,
            //   pricesDict,
            // )
            break
          }
          case WebhookAction.DCA: {
            const amountUSD = Number(actionBody)
            await this.binanceSpotTradingService.dca(amountUSD, pairs)
            break
          }
          case WebhookAction.SellPercent: {
            const sellPercent = Number(actionBody)
            await this.binanceSpotTradingService.sellDCA(sellPercent, pairs)
            break
          }

          // FUTURES
          case WebhookAction.SmartLong: {
            const ticker = actionBody
            const leverage = await this.smartTradingService.getAutoLeverage(
              ticker,
              PositionSide.LONG,
              0,
              maxLeverageFromSetting,
            )
            const dto: TradingCommandDto = {
              symbol: ticker,
              side: PositionSide.LONG,
              amountUSD: futuresAmountUSDFromSetting,
              leverage,
            }

            await this.smartTradingService.futuresTrade(dto)
            break
          }
          case WebhookAction.SmartShort: {
            const ticker = actionBody
            const leverage = await this.smartTradingService.getAutoLeverage(
              ticker,
              PositionSide.SHORT,
              0,
              maxLeverageFromSetting,
            )
            const dto: TradingCommandDto = {
              symbol: ticker,
              side: PositionSide.SHORT,
              amountUSD: futuresAmountUSDFromSetting,
              leverage,
            }

            await this.smartTradingService.futuresTrade(dto)
            break
          }
        }
      } catch (e) {
        this.logger.error('failed to process the message', e, message)
      } finally {
        await wait(1)
        this.messagesInProgressDict[message] = false
      }
    }

    this.logger.info('processed webhook from tradingview')
  }
}

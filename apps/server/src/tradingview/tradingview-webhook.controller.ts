import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import { Request } from 'express'

import { BinanceSpotStrategyService } from '../binance/binance-spot-strategy.service'
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
    private tickerService: TickerService,
    private logger: LogService,
  ) {}

  @Post(':token')
  async webhookFromTradingview(
    @Param('token') token: string,
    @Body() rawMessage: string,
    @Req() request: Request,
  ) {
    console.log(request.headers)

    if (token !== this.configService.getTradingViewToken()) {
      this.logger.error('token is invalid', token)
      throw new ForbiddenException()
    }

    this.logger.info('processing webhook from tradingview', rawMessage)
    const pairs = await this.tickerService.getPairs()

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
          case WebhookAction.RebalanceTo: {
            const rebalanceToUSD = Number(actionBody)
            await this.binanceSpotTradingService.rebalance(
              rebalanceToUSD,
              pairs,
              true,
            )
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

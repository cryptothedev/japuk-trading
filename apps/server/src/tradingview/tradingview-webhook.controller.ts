import { PositionSide } from '@japuk/models'
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

import { SettingService } from '../client-api/setting/setting.service'
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
    this.logger.info('processing webhook from tradingview', rawMessage)

    const senderIp: string = requestIp.getClientIp(request)
    const validIp = TRADINGVIEW_IPS.some((tradingviewIp) =>
      senderIp.includes(tradingviewIp),
    )
    if (!validIp) {
      this.logger.error('sender is not from tradingview', senderIp)
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

    const messages = rawMessage.split('\n').filter(Boolean)

    for (const message of messages) {
      try {
        // check double action
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
        this.logger.info('action in progress', webhookAction, actionBody)

        switch (webhookAction) {
          // Alert
          case WebhookAction.Alert: {
            await this.tradingviewWebhookService.processAlert(actionBody)
            break
          }

          // SPOT
          case WebhookAction.RebalanceTo: {
            const tickers = await this.tickerService.getTickers()
            await this.tradingviewWebhookService.rebalanceTo(
              actionBody,
              setting,
              tickers,
            )
            break
          }

          case WebhookAction.Rebalance: {
            await this.tradingviewWebhookService.rebalancePair(
              actionBody,
              setting,
            )
            break
          }

          // FUTURES
          case WebhookAction.SmartLong: {
            await this.tradingviewWebhookService.smartFuturesTrade(
              actionBody,
              PositionSide.LONG,
              setting,
            )
            break
          }

          case WebhookAction.SmartShort: {
            await this.tradingviewWebhookService.smartFuturesTrade(
              actionBody,
              PositionSide.SHORT,
              setting,
            )
            break
          }

          case WebhookAction.CloseLong: {
            await this.tradingviewWebhookService.closeFuturesPosition(
              actionBody,
              PositionSide.LONG,
            )
            break
          }

          case WebhookAction.CloseShort: {
            await this.tradingviewWebhookService.closeFuturesPosition(
              actionBody,
              PositionSide.SHORT,
            )
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

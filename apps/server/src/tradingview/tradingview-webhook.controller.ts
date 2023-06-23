import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
} from '@nestjs/common'

import { ConfigService } from '../core/config.service'
import { LogService } from '../core/log.service'
import { wait } from '../utils/wait'
import { WebhookAction } from './models/WebhookAction'
import { TradingviewWebhookService } from './tradingview-webhook.service'
import { getWebhookAction } from './utils/getWebhookAction'

@Controller('tradingview-webhook')
export class TradingviewWebhookController {
  private messagesInProgressDict: Record<string, boolean> = {}

  constructor(
    private configService: ConfigService,
    private tradingviewWebhookService: TradingviewWebhookService,
    private logger: LogService,
  ) {}

  @Post(':token')
  async webhookFromTradingview(
    @Param('token') token: string,
    @Body() rawMessage: string,
  ) {
    if (token !== this.configService.getTradingViewToken()) {
      this.logger.error('token is invalid', token)
      throw new ForbiddenException()
    }

    this.logger.info('processing webhook from tradingview', rawMessage)

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
            break
          }
          case WebhookAction.DCA: {
            break
          }
          case WebhookAction.SellPercent: {
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

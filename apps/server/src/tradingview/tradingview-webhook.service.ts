import { Injectable } from '@nestjs/common'

import { AlertLogGateway } from '../client-api/alert-log/alert-log.gateway'
import { AlertLogService } from '../client-api/alert-log/alert-log.service'
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
  ) {}
  async processWebhookFromTradingview(actionBody: string) {
    const [coin, price, reason] = actionBody.split(':')

    const alertLogDoc = await this.alertLogRepo.create({
      coin,
      price,
      reason,
    })

    await this.telegramClientService.callToAlert(
      `<b>${coin}</b> ณ ราคา <b>${price}</b>
เหตุผล <b>${reason}</b>`,
    )

    const { chatId, threadId } =
      this.configService.getNukZingBotTradeAlertThreadConfig()

    await this.telegramBotService.sendMessage(
      `<b>${coin}</b>> ณ ราคา <b>${price}</b>
เหตุผล <b>${reason}</b>`,
      chatId,
      threadId,
    )

    await this.alertLogGateway.newAlertLog(
      this.alertLogService.toAlertLogResponse(alertLogDoc),
    )
  }
}

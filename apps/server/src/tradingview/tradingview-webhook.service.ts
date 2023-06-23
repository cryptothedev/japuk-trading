import { Injectable } from '@nestjs/common'

import { AlertLogGateway } from '../client-api/alert-log.gateway'
import { AlertLogService } from '../client-api/alert-log.service'
import { AlertLogRepo } from '../database/alert-log-repo'

@Injectable()
export class TradingviewWebhookService {
  constructor(
    private alertLogRepo: AlertLogRepo,
    private alertLogGateway: AlertLogGateway,
    private alertLogService: AlertLogService,
  ) {}
  async processWebhookFromTradingview(actionBody: string) {
    const [coin, price, reason] = actionBody.split(':')

    const alertLogDoc = await this.alertLogRepo.createOne({
      coin,
      price,
      reason,
    })

    await this.alertLogGateway.newAlertLog(
      this.alertLogService.toAlertLogResponse(alertLogDoc),
    )
  }
}

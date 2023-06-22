import { Injectable } from '@nestjs/common'

import { AlertLogGateway } from '../client-api/alert-log.gateway'
import { AlertLogService } from '../client-api/alert-log.service'
import { AlertLogRepo } from '../database/alert-log-repo'
import { TradingviewAlertDto } from './tradingview-alert.dto'

@Injectable()
export class TradingviewWebhookService {
  constructor(
    private alertLogRepo: AlertLogRepo,
    private alertLogGateway: AlertLogGateway,
    private alertLogService: AlertLogService,
  ) {
    setInterval(() => {
      this.processWebhookFromTradingview({
        coin: 'BTCUSDT',
        price: '30000.5',
        reason: 'BTC ชนแนวรับ Fibo 61.8',
      })
    }, 5000)
  }
  async processWebhookFromTradingview(
    tradingviewAlertDto: TradingviewAlertDto,
  ) {
    const alertLogDoc = await this.alertLogRepo.createOne(tradingviewAlertDto)

    await this.alertLogGateway.newAlertLog(
      this.alertLogService.toAlertLogResponse(alertLogDoc),
    )
  }
}

import { Body, Controller, Post } from '@nestjs/common'

import { ConfigService } from '../core/config.service'
import { TradingviewAlertDto } from './tradingview-alert.dto'

@Controller('tradingview-webhook')
export class TradingviewWebhookController {
  constructor(private configService: ConfigService) {}

  @Post()
  webhookFromTradingview(@Body() tradingviewAlertDto: TradingviewAlertDto) {
    const { coin, price, reason } = tradingviewAlertDto

    // add to database

    // push via webhook
  }
}

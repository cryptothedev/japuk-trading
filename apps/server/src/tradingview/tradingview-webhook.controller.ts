import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Post,
} from '@nestjs/common'

import { ConfigService } from '../core/config.service'
import { LogService } from '../core/log.service'
import { TradingviewAlertDto } from './tradingview-alert.dto'
import { TradingviewWebhookService } from './tradingview-webhook.service'

@Controller('tradingview-webhook')
export class TradingviewWebhookController {
  constructor(
    private configService: ConfigService,
    private tradingviewWebhookService: TradingviewWebhookService,
    private logger: LogService,
  ) {}

  @Post(':token')
  async webhookFromTradingview(
    @Param('token') token: string,
    @Body() tradingviewAlertDto: TradingviewAlertDto,
  ) {
    if (token !== this.configService.getTradingViewToken()) {
      this.logger.error('token is invalid', token)
      throw new ForbiddenException()
    }

    this.logger.info('processing webhook from tradingview', tradingviewAlertDto)

    await this.tradingviewWebhookService.processWebhookFromTradingview(
      tradingviewAlertDto,
    )

    this.logger.info('processed webhook from tradingview')
  }
}

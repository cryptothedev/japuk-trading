import { Controller } from '@nestjs/common'

import { ConfigService } from '../core/config.service'

@Controller('tradingview-webhook')
export class TradingviewWebhookController {
  constructor(private configService: ConfigService) {}
}

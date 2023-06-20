import { Injectable } from '@nestjs/common'
import * as dotenv from 'dotenv'
import * as process from 'process'

dotenv.config()

@Injectable()
export class ConfigService {
  getTradingViewToken() {
    return process.env['TRADINGVIEW_WEBHOOK_TOKEN'] as string
  }
}

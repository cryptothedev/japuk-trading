import { Injectable } from '@nestjs/common'
import * as dotenv from 'dotenv'
import * as process from 'process'

dotenv.config()

@Injectable()
export class ConfigService {
  getTradingViewToken() {
    return process.env['TRADINGVIEW_WEBHOOK_TOKEN'] as string
  }

  getMongooseURI() {
    return process.env['MONGOOSE_URI'] as string
  }

  getBinanceSpotConfig() {
    return {
      apiKey: process.env['BINANCE_API_KEY'] as string,
      apiSecret: process.env['BINANCE_API_SECRET'] as string,
    }
  }

  getDCAPairs() {
    const dcaPairsText = process.env['DCA_PAIRS'] as string
    return dcaPairsText.split(',').map((pair) => pair.trim())
  }
}

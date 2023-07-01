import { Injectable } from '@nestjs/common'
import * as dotenv from 'dotenv'
import * as process from 'process'

dotenv.config()

@Injectable()
export class ConfigService {
  getWebAppTokenConfig() {
    return {
      webPassword: process.env['WEBAPP_PASSWORD'],
      apiToken: process.env['WEBAPP_API_TOKEN'],
    }
  }

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

  getBinanceFuturesConfig() {
    return {
      apiKey: process.env['BINANCE_API_KEY'] as string,
      apiSecret: process.env['BINANCE_API_SECRET'] as string,
    }
  }
}

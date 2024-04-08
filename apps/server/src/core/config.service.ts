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

  getTgClientConfig() {
    return {
      apiId: Number(process.env['TG_CLIENT_API_ID']),
      alertUserId: process.env['TG_CLIENT_ALERT_USER_ID'] as string,
      apiHash: process.env['TG_CLIENT_API_HASH'] as string,
      stringSession: process.env['TG_CLIENT_STRING_SESSION'] as string,
      phoneNumber: process.env['TG_CLIENT_PHONE_NUMBER'] as string,
    }
  }

  getTgBotToken() {
    return process.env['TG_BOT_TOKEN'] as string
  }

  getNukZingBotTradeAlertThreadConfig() {
    return {
      chatId: process.env['NUKZING_CHAT_ID'] as string,
      threadId: Number(process.env['NUKZING_BOT_TRADING_ALERT_THREAD_ID']),
    }
  }

  getNukZingAnnId() {
    return process.env['NUKZING_ANN_ID'] as string
  }
}

import { Injectable } from '@nestjs/common'
import { WebsocketClient, WsFormattedMessage } from 'binance'

import { ConfigService } from '../core/config.service'

type Listener = (event: WsFormattedMessage) => Promise<void>

@Injectable()
export class BinanceWsService {
  private websocket: WebsocketClient
  private listeners: Listener[] = []

  constructor(private configService: ConfigService) {
    const { apiKey, apiSecret } = this.configService.getBinanceSpotConfig()

    this.websocket = new WebsocketClient({
      api_key: apiKey,
      api_secret: apiSecret,
      beautify: true,
    })

    this.listen()
  }

  async listen() {
    this.websocket.on('open', (data) => {
      console.log('connection opened open:', data.wsKey, data.ws.url)
    })

    this.websocket.on('formattedMessage', async (event) => {
      for (const listner of this.listeners) {
        await listner(event)
      }
    })

    this.websocket.on('reconnecting', (data) => {
      console.log('ws automatically reconnecting.... ', data?.wsKey)
    })

    this.websocket.on('reconnected', (data) => {
      console.log('ws has reconnected ', data?.wsKey)
    })

    await this.websocket.subscribeUsdFuturesUserDataStream()
    await this.websocket.subscribeSpotAll24hrTickers()
    await this.websocket.subscribeAllMarketMarkPrice('usdm')
  }

  addListener(listener: Listener) {
    this.listeners.push(listener)
  }
}

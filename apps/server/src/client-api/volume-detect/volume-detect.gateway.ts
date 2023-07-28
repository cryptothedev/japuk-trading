import { HighVolumeEvent, HighVolumeTicker } from '@japuk/models'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { WsFormattedMessage, WsMessage24hrTickerFormatted } from 'binance'
import { Server, Socket } from 'socket.io'

import { BinanceWsService } from '../../binance/binance-ws.service'
import { LogService } from '../../core/log.service'

const EXCLUDE_PAIRS = ['BTCUSDT', 'BUSDUSDT', 'ETHUSDT', 'BUSDTRY']

@WebSocketGateway({ namespace: 'volume-detect', cors: true })
export class VolumeDetectGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server
  constructor(
    private binanceWsService: BinanceWsService,
    private logger: LogService,
  ) {
    this.binanceWsService.addListener(this.listen)
  }

  listen = async (event: WsFormattedMessage) => {
    if (!Array.isArray(event)) {
      return
    }

    if (event[0].eventType !== '24hrTicker') {
      return
    }

    const events = event as any as WsMessage24hrTickerFormatted[]

    const highVolumeTickers = events
      .filter(
        (event) =>
          event.symbol.includes('USDT') &&
          !EXCLUDE_PAIRS.includes(event.symbol),
      )
      .filter((event) => event.priceChangePercent > 5)
      .sort((a, b) => {
        if (a.quoteAssetVolume > b.quoteAssetVolume) {
          return -1
        }

        if (a.quoteAssetVolume < b.quoteAssetVolume) {
          return 1
        }

        return 0
      })
      .map((event) => {
        const {
          symbol,
          quoteAssetVolume,
          priceChangePercent,
          currentClose,
          weightedAveragePrice,
        } = event
        return {
          symbol,
          volumeInUSDT: (quoteAssetVolume / 1_000_000).toLocaleString(),
          priceChange: priceChangePercent,
          close: currentClose,
          averagePrice: weightedAveragePrice,
        } as HighVolumeTicker
      })
      .slice(0, 30)

    this.newEvents(highVolumeTickers)
  }

  afterInit(server: Server) {
    this.logger.info('Initialized')
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.info(`Client Connected: ${client.id}`)
  }

  handleDisconnect(client: Socket): any {
    this.logger.info(`Client Disconnected: ${client.id}`)
  }

  newEvents(highVolumeTickers: HighVolumeTicker[]) {
    this.wss.emit(HighVolumeEvent.New, highVolumeTickers)
  }
}

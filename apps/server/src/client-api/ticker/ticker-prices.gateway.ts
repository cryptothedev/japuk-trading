import { TickerEvent, TickerPriceWs } from '@japuk/models'
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

const EXCLUDE_PAIRS = ['BUSDUSDT', 'BUSDTRY']

@WebSocketGateway({ namespace: 'ticker-prices', cors: true })
export class TickerPricesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server
  constructor(
    private logger: LogService,
    private binanceWsService: BinanceWsService,
  ) {
    this.binanceWsService.addListener(this.listenPricesChange)
  }

  listenPricesChange = async (event: WsFormattedMessage) => {
    if (!Array.isArray(event)) {
      return
    }

    if (event[0].eventType !== '24hrTicker') {
      return
    }

    const events = event as any as WsMessage24hrTickerFormatted[]

    const pricesDict = events
      .filter(
        (event) =>
          event.symbol.includes('USDT') &&
          !EXCLUDE_PAIRS.includes(event.symbol),
      )
      .reduce((dict, priceInfo) => {
        const { symbol, currentClose, open, high, low } = priceInfo
        dict[symbol] = { open, high, low, close: currentClose }
        return dict
      }, {} as Record<string, TickerPriceWs>)

    this.newPrices(pricesDict)
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

  private newPrices(pricesDict: Record<string, TickerPriceWs>) {
    this.wss.emit(TickerEvent.Price, pricesDict)
  }
}

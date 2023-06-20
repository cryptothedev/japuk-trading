import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { LogService } from '../core/log.service'

@WebSocketGateway({ namespace: 'alert-log', cors: true })
export class AlertLogGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server
  constructor(private logger: LogService) {
    setInterval(() => {
      this.wss.emit('new', 'new log')
      console.log('running')
    }, 1000)
  }

  afterInit(server: Server) {
    this.logger.log('Initialized')
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected: ${client.id}`)
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Client Disconnected: ${client.id}`)
  }
}

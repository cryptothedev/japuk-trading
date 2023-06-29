import { AlertLogEvent, AlertLogResponse } from '@japuk/models'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { LogService } from '../../core/log.service'

@WebSocketGateway({ namespace: 'alert-log', cors: true })
export class AlertLogGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server
  constructor(private logger: LogService) {}

  afterInit(server: Server) {
    this.logger.info('Initialized')
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.info(`Client Connected: ${client.id}`)
  }

  handleDisconnect(client: Socket): any {
    this.logger.info(`Client Disconnected: ${client.id}`)
  }

  newAlertLog(alertLogResponse: AlertLogResponse) {
    this.wss.emit(AlertLogEvent.New, alertLogResponse)
  }
}

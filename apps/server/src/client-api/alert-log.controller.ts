import { Controller, Get } from '@nestjs/common'

import { AlertLogService } from './alert-log.service'

@Controller('alert-log')
export class AlertLogController {
  constructor(private alertLogService: AlertLogService) {}

  @Get()
  getAllAlertLogs() {
    return this.alertLogService.getAllAlertLogs()
  }
}

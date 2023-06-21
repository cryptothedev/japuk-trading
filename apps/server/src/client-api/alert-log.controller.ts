import { Controller, Get, Param, Patch } from '@nestjs/common'

import { AlertLogService } from './alert-log.service'

@Controller('alert-log')
export class AlertLogController {
  constructor(private alertLogService: AlertLogService) {}

  @Get()
  getAllAlertLogs() {
    return this.alertLogService.getAllAlertLogs()
  }

  @Patch(':id')
  dismiss(@Param('id') id: string) {
    return this.alertLogService.dismiss(id)
  }
}

import { Controller, Get, Param, Patch } from '@nestjs/common'

import { AlertLogService } from './alert-log.service'

@Controller('alert-log')
export class AlertLogController {
  constructor(private alertLogService: AlertLogService) {}

  @Get()
  getAll() {
    return this.alertLogService.getAll()
  }

  @Patch(':id')
  dismiss(@Param('id') id: string) {
    return this.alertLogService.dismiss(id)
  }
}

import { AlertLogResponse } from '@japuk/models'
import { BadRequestException, Injectable } from '@nestjs/common'

import { LogService } from '../../core/log.service'
import { AlertLogRepo } from '../../database/alert-log/alert-log.repo'
import { AlertLogDocument } from '../../database/alert-log/alert-log.schema'

@Injectable()
export class AlertLogService {
  constructor(private logger: LogService, private alertLogRepo: AlertLogRepo) {}

  async getAll() {
    const alertLogDocs = await this.alertLogRepo.findAll()
    return alertLogDocs.map(this.toAlertLogResponse)
  }

  async dismiss(id: string) {
    const updated = await this.alertLogRepo.dismiss(id)
    if (!updated) {
      this.logger.error('failed to dismiss alert log the id does not exist', {
        id,
      })
      throw new BadRequestException()
    }
    return this.toAlertLogResponse(updated)
  }

  toAlertLogResponse(alertLogDoc: AlertLogDocument): AlertLogResponse {
    const { _id, coin, price, reason, dismissed, createdAt } = alertLogDoc

    return {
      id: _id.toString(),
      coin,
      price,
      reason,
      dismissed,
      createdAt,
    }
  }
}

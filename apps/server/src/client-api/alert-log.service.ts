import { AlertLogResponse } from '@japuk/models'
import { Injectable } from '@nestjs/common'

import { LogService } from '../core/log.service'
import { AlertLogRepo } from '../database/alert-log-repo'
import { AlertLogDocument } from '../database/alert-log.schema'

@Injectable()
export class AlertLogService {
  constructor(private logger: LogService, private alertLogRepo: AlertLogRepo) {}

  async getAllAlertLogs() {
    const alertLogDocs = await this.alertLogRepo.getAll()
    return alertLogDocs.map(this.toAlertLogResponse)
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

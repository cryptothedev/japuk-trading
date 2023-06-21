import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { TradingviewAlertDto } from '../tradingview/tradingview-alert.dto'
import { AlertLog, AlertLogDocument } from './alert-log.schema'

@Injectable()
export class AlertLogRepo {
  constructor(
    @InjectModel(AlertLog.name) private alertLogModel: Model<AlertLogDocument>,
  ) {}

  async createOne(tradingviewAlertDto: TradingviewAlertDto) {
    const created: AlertLog = {
      ...tradingviewAlertDto,
      dismissed: false,
    }
    return this.alertLogModel.create(created)
  }

  getAll() {
    return this.alertLogModel.find().exec()
  }
}

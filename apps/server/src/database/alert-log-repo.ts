import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { TradingviewAlert } from '../tradingview/tradingview-alert'
import { AlertLog, AlertLogDocument } from './alert-log.schema'

@Injectable()
export class AlertLogRepo {
  constructor(
    @InjectModel(AlertLog.name) private alertLogModel: Model<AlertLogDocument>,
  ) {}

  async createOne(tradingviewAlertDto: TradingviewAlert) {
    const created: AlertLog = {
      ...tradingviewAlertDto,
      dismissed: false,
    }
    return this.alertLogModel.create(created)
  }

  getAll() {
    return this.alertLogModel.find().exec()
  }

  async dismiss(id: string) {
    return this.alertLogModel
      .findByIdAndUpdate(
        id,
        {
          $set: { dismissed: true },
        },
        { new: true },
      )
      .exec()
  }
}

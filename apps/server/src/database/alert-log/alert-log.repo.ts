import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { TradingviewAlertDto } from '../../tradingview/tradingview-alert.dto'
import { AlertLog, AlertLogDocument } from './alert-log.schema'

@Injectable()
export class AlertLogRepo {
  constructor(
    @InjectModel(AlertLog.name) private alertLogModel: Model<AlertLogDocument>,
  ) {}

  create(tradingviewAlertDto: TradingviewAlertDto): Promise<AlertLogDocument> {
    const creating: AlertLog = {
      ...tradingviewAlertDto,
      dismissed: false,
    }
    return this.alertLogModel.create(creating)
  }

  findAll(): Promise<AlertLogDocument[]> {
    return this.alertLogModel.find({ dismissed: false }).exec()
  }

  async dismiss(id: string): Promise<AlertLogDocument | null> {
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

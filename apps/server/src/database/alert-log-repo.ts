import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { AlertLog } from './alert-log.schema'

@Injectable()
export class AlertLogRepo {
  constructor(
    @InjectModel(AlertLog.name) private alertLogModel: Model<AlertLog>,
  ) {}
}

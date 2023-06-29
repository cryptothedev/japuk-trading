import { UpsertSettingDto } from '@japuk/models'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Setting, SettingDocument } from './setting.schema'

@Injectable()
export class SettingRepo {
  constructor(
    @InjectModel(Setting.name) private alertLogModel: Model<SettingDocument>,
  ) {}

  upsert(dto: UpsertSettingDto) {
    const { rebalanceToUSD } = dto
    const upserting: Setting = {
      rebalanceToUSD,
    }
    return this.alertLogModel.findOneAndUpdate({}, upserting, {
      upsert: true,
      new: true,
    })
  }

  findOne() {
    return this.alertLogModel.findOne({}).exec()
  }
}

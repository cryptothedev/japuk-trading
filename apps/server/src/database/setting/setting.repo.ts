import { UpsertSettingDto } from '@japuk/models'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Setting, SettingDocument } from './setting.schema'

@Injectable()
export class SettingRepo {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  upsert(dto: UpsertSettingDto): Promise<SettingDocument> {
    const { rebalanceToUSD, futuresAmountUSD, maxLeverage, username, avatarUrl } = dto
    const upserting: Setting = {
      rebalanceToUSD,
      futuresAmountUSD,
      maxLeverage,
      username,
      avatarUrl
    }
    return this.settingModel
      .findOneAndUpdate({}, upserting, {
        upsert: true,
        new: true,
      })
      .exec()
  }

  findOne(): Promise<SettingDocument | null> {
    return this.settingModel.findOne({}).exec()
  }
}

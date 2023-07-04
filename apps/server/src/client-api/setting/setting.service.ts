import { SettingResponse, UpsertSettingDto } from '@japuk/models'
import { Injectable } from '@nestjs/common'

import { SettingRepo } from '../../database/setting/setting.repo'
import { SettingDocument } from '../../database/setting/setting.schema'

@Injectable()
export class SettingService {
  constructor(private settingRepo: SettingRepo) {}
  async getOne() {
    const setting = await this.settingRepo.findOne()
    if (!setting) {
      return null
    }

    return this.toSettingResponse(setting)
  }

  async upsert(upsertSettingDto: UpsertSettingDto) {
    const upserted = await this.settingRepo.upsert(upsertSettingDto)
    return this.toSettingResponse(upserted)
  }

  toSettingResponse(settingDoc: SettingDocument): SettingResponse {
    const { _id, rebalanceToUSD, futuresAmountUSD, maxLeverage } = settingDoc
    return { id: _id.toString(), rebalanceToUSD, futuresAmountUSD, maxLeverage }
  }
}

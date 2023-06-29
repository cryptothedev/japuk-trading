import { UpsertSettingDto } from '@japuk/models'
import { Injectable } from '@nestjs/common'

import { SettingRepo } from '../../database/setting/setting.repo'

@Injectable()
export class SettingService {
  constructor(private settingRepo: SettingRepo) {}
  getSetting() {
    return this.settingRepo.findOne()
  }

  upsertSetting(upsertSettingDto: UpsertSettingDto) {
    return this.settingRepo.upsert(upsertSettingDto)
  }
}

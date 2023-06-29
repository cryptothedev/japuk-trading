import { UpsertSettingDto } from '@japuk/models'
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'

import { SettingService } from './setting.service'

@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get()
  getOne() {
    return this.settingService.getSetting()
  }

  @Post()
  upsert(@Body() upsertSettingDto: UpsertSettingDto) {
    return this.settingService.upsertSetting(upsertSettingDto)
  }
}

import { UpsertSettingDto } from '@japuk/models'
import { Body, Controller, Get, Post } from '@nestjs/common'

import { SettingService } from './setting.service'

@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get()
  getOne() {
    return this.settingService.getOne()
  }

  @Post()
  upsert(@Body() upsertSettingDto: UpsertSettingDto) {
    return this.settingService.upsert(upsertSettingDto)
  }
}

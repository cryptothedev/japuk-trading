import { UpsertSettingDto } from '@japuk/models'
import { Body, Controller, Param, Post } from '@nestjs/common'

import { RebalanceService } from './rebalance.service'

@Controller('rebalance')
export class RebalanceController {
  constructor(private rebalanceService: RebalanceService) {}
  @Post()
  rebalanceAll(@Body() upsertSettingDto: UpsertSettingDto) {
    return this.rebalanceService.rebalanceAll()
  }

  @Post(':pair')
  rebalanceOne(@Param('pair') pair: string) {
    return this.rebalanceService.rebalanceOne(pair)
  }
}

import { SuccessResponse, UpsertSettingDto } from '@japuk/models'
import { Body, Controller, Param, Post } from '@nestjs/common'

import { RebalanceService } from './rebalance.service'

@Controller('rebalance')
export class RebalanceController {
  constructor(private rebalanceService: RebalanceService) {}
  @Post()
  async rebalanceAll(@Body() upsertSettingDto: UpsertSettingDto) {
    await this.rebalanceService.rebalanceAll()
    return SuccessResponse
  }

  @Post(':id')
  async rebalanceOne(@Param('id') id: string) {
    await this.rebalanceService.rebalanceOne(id)
    return SuccessResponse
  }
}

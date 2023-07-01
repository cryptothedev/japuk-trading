import { Controller, Get, Param } from '@nestjs/common'

import { SmartTradingService } from './smart-trading.service'

@Controller('smart-trading')
export class SmartTradingController {
  constructor(private smartTradingService: SmartTradingService) {}
  @Get(':ticker')
  getTradingInfo(@Param('ticker') ticker: string) {
    return this.smartTradingService.getTradingInfo(ticker)
  }
}

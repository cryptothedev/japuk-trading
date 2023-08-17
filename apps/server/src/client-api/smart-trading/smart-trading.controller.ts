import {
  ClosePositionCommandDto,
  FuturesPositionResponse,
  SuccessResponse,
  TradingCommandDto,
} from '@japuk/models'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { SmartTradingService } from './smart-trading.service'

@Controller('smart-trading')
export class SmartTradingController {
  constructor(private smartTradingService: SmartTradingService) {}

  @Get('current-position')
  getCurrentPositions(): Promise<FuturesPositionResponse[]> {
    return this.smartTradingService.getCurrentPositions()
  }

  @Get(':ticker')
  getTradingInfo(@Param('ticker') ticker: string) {
    return this.smartTradingService.getTradingInfo(ticker)
  }

  @Post('futures-trade')
  async futuresTrade(@Body() tradingCommandDto: TradingCommandDto) {
    await this.smartTradingService.futuresTrade(tradingCommandDto)
    return SuccessResponse
  }

  @Post('futures-close')
  async futuresClose(@Body() closePositionCommandDto: ClosePositionCommandDto) {
    await this.smartTradingService.closePosition(closePositionCommandDto)
    return SuccessResponse
  }
}

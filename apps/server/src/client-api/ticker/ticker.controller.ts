import { UpsertTickersDto } from '@japuk/models'
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

import { TickerService } from './ticker.service'

@Controller('ticker')
export class TickerController {
  constructor(private tickerService: TickerService) {}

  @Get()
  get() {
    return this.tickerService.get()
  }

  @Post()
  upsert(@Body() upsertTickersDto: UpsertTickersDto) {
    return this.tickerService.upsert(upsertTickersDto)
  }

  @Put(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.tickerService.toggle(id)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tickerService.delete(id)
  }
}

import { UpsertTickerDto } from '@japuk/models'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'

import { TickerService } from './ticker.service'

@Controller('ticker')
export class TickerController {
  constructor(private tickerService: TickerService) {}

  @Get()
  get() {
    return this.tickerService.get()
  }

  @Post()
  upsert(@Body() upsertTickerDto: UpsertTickerDto) {
    return this.tickerService.upsert(upsertTickerDto)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tickerService.delete(id)
  }
}

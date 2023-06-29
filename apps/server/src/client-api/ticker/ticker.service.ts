import { TickerResponse, UpsertTickerDto } from '@japuk/models'
import { BadRequestException, Injectable } from '@nestjs/common'

import { LogService } from '../../core/log.service'
import { TickerRepo } from '../../database/ticker/ticker.repo'
import { TickerDocument } from '../../database/ticker/ticker.schema'

@Injectable()
export class TickerService {
  constructor(private tickerRepo: TickerRepo, private logger: LogService) {}
  async get() {
    const tickers = await this.tickerRepo.find()
    return tickers.map(this.toTickerResponse)
  }

  async upsert(upsertTickerDto: UpsertTickerDto) {
    const upserted = await this.tickerRepo.upsert(upsertTickerDto)
    return this.toTickerResponse(upserted)
  }

  async delete(id: string) {
    const deleted = await this.tickerRepo.delete(id)
    if (!deleted) {
      this.logger.error('failed to delete ticker the id does not exist', {
        id,
      })
      throw new BadRequestException()
    }
    return this.toTickerResponse(deleted)
  }

  toTickerResponse(tickerDoc: TickerDocument): TickerResponse {
    const { _id, name } = tickerDoc
    return { id: _id.toString(), name }
  }
}

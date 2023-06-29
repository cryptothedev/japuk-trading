import { UpsertTickerDto } from '@japuk/models'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Ticker, TickerDocument } from './ticker.schema'

@Injectable()
export class TickerRepo {
  constructor(
    @InjectModel(Ticker.name) private tickerModel: Model<TickerDocument>,
  ) {}

  find(): Promise<TickerDocument[]> {
    return this.tickerModel.find({}).exec()
  }

  upsert(upsertTickerDto: UpsertTickerDto): Promise<TickerDocument> {
    const { name } = upsertTickerDto
    const upserting: Ticker = {
      name,
    }
    return this.tickerModel
      .findOneAndUpdate({ name }, upserting, {
        upsert: true,
        new: true,
      })
      .exec()
  }

  delete(id: string): Promise<TickerDocument | null> {
    return this.tickerModel.findByIdAndDelete(id).exec()
  }
}
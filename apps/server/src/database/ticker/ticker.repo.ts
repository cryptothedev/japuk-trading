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
    return this.tickerModel.find({ isDisabled: { $ne: true } }).exec()
  }

  upsert(pair: string): Promise<TickerDocument> {
    const upserting: Ticker = {
      pair,
    }
    return this.tickerModel
      .findOneAndUpdate({ pair, isDisabled: false }, upserting, {
        upsert: true,
        new: true,
      })
      .exec()
  }

  delete(id: string): Promise<TickerDocument | null> {
    return this.tickerModel.findByIdAndDelete(id).exec()
  }

  findById(id: string): Promise<TickerDocument | null> {
    return this.tickerModel.findById(id).exec()
  }

  toggle(id: string): Promise<TickerDocument | null> {
    return this.tickerModel
      .findByIdAndUpdate(
        id,
        {
          $set: { isDisabled: { $not: '$isDisabled' } },
        },
        { new: true },
      )
      .exec()
  }
}

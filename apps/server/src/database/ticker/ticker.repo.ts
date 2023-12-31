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
    return this.tickerModel.find().exec()
  }

  upsert(pair: string): Promise<TickerDocument> {
    const upserting: Ticker = {
      pair,
      isDisabled: false,
      gains: [],
    }
    return this.tickerModel
      .findOneAndUpdate({ pair }, upserting, {
        upsert: true,
        new: true,
      })
      .exec()
  }

  delete(id: string): Promise<TickerDocument | null> {
    return this.tickerModel.findByIdAndDelete(id).exec()
  }

  pushGain(pair: string, gain: number): Promise<TickerDocument | null> {
    return this.tickerModel
      .findOneAndUpdate(
        { pair },
        {
          $push: { gains: { $each: [gain], $slice: -10 } },
        },
        { new: true },
      )
      .exec()
  }

  findById(id: string): Promise<TickerDocument | null> {
    return this.tickerModel.findById(id).exec()
  }

  toggle(id: string): Promise<TickerDocument | null> {
    return this.tickerModel
      .findByIdAndUpdate(
        id,
        [
          {
            $set: { isDisabled: { $not: '$isDisabled' } },
          },
        ],
        { new: true },
      )
      .exec()
  }
}

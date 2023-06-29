import { WithTimestamp } from '@japuk/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TickerDocument = HydratedDocument<Ticker, WithTimestamp>

@Schema({ timestamps: true })
export class Ticker {
  @Prop({ type: String, required: true, unique: true })
  name: string
}

export const TickerSchema = SchemaFactory.createForClass(Ticker)

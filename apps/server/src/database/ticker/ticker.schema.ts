import { WithTimestamp } from '@japuk/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TickerDocument = HydratedDocument<Ticker, WithTimestamp>

@Schema({ timestamps: true })
export class Ticker {
  @Prop({ type: String, required: true, unique: true })
  pair: string

  @Prop({ type: Boolean })
  isDisabled?: boolean
}

export const TickerSchema = SchemaFactory.createForClass(Ticker)

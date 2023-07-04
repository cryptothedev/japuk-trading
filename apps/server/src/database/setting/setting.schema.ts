import { WithTimestamp } from '@japuk/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type SettingDocument = HydratedDocument<Setting, WithTimestamp>

@Schema({ timestamps: true })
export class Setting {
  @Prop({ type: Number, required: true })
  rebalanceToUSD: number

  @Prop({ type: Number, required: true })
  futuresAmountUSD: number

  @Prop({ type: Number, required: true })
  maxLeverage: number
}

export const SettingSchema = SchemaFactory.createForClass(Setting)

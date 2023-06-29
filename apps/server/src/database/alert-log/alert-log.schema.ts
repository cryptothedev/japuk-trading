import { WithTimestamp } from '@japuk/models'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type AlertLogDocument = HydratedDocument<AlertLog, WithTimestamp>

@Schema({ timestamps: true })
export class AlertLog {
  @Prop({ type: String, required: true })
  coin: string

  @Prop({ type: String, required: true })
  price: string

  @Prop({ type: String, required: true })
  reason: string

  @Prop({ type: Boolean, required: true })
  dismissed: boolean
}

export const AlertLogSchema = SchemaFactory.createForClass(AlertLog)

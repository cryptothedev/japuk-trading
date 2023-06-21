import { IsoString } from './shared'

export const enum AlertLogEvent {
  New = 'new',
}

export interface AlertLogResponse {
  id: string
  coin: string
  price: string
  reason: string
  dismissed: boolean
  createdAt: IsoString
}

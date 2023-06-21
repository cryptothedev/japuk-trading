import { IsoString } from './shared'

export enum AlertLogEvent {
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

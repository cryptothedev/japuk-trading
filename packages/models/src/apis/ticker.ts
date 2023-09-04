export const enum TickerEvent {
  Price = 'price',
}

export interface UpsertTickersDto {
  pairs: string[]
}

export interface TickerResponse {
  id: string
  pair: string
  price: number
  amount: number
  value: number
  isDisabled: boolean
}

export interface TickerPriceWs {
  open: number
  high: number
  low: number
  close: number
}

export interface UpsertTickersDto {
  pairs: string[]
}

export interface TickerResponse {
  id: string
  pair: string
  price: number
  amount: number
  value: number
}

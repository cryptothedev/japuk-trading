export interface UpsertTickerDto {
  pair: string
}

export interface TickerResponse {
  id: string
  pair: string
  price: number
  amount: number
  value: number
}

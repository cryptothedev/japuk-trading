export interface UpsertSettingDto {
  rebalanceToUSD: number
  futuresAmountUSD: number
  maxLeverage: number
}

export interface SettingResponse {
  id: string
  rebalanceToUSD: number
  futuresAmountUSD: number
  maxLeverage: number
}

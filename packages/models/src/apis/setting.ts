export interface UpsertSettingDto {
  rebalanceToUSD: number
  futuresAmountUSD: number
}

export interface SettingResponse {
  id: string
  rebalanceToUSD: number
  futuresAmountUSD: number
}

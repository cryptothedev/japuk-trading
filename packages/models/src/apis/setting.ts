export interface UpsertSettingDto {
  rebalanceToUSD: number
  futuresAmountUSD: number
  maxLeverage: number
  username: string
  avatarUrl: string
}

export interface SettingResponse {
  id: string
  rebalanceToUSD: number
  futuresAmountUSD: number
  maxLeverage: number
  username: string
  avatarUrl: string
}

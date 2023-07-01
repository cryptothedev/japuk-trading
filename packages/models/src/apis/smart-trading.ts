export enum PositionSide {
  BOTH = 'BOTH',
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export interface TradingCommandDto {
  symbol: string
  side: PositionSide
  amountUSD: number
  setTp: boolean | null
  tp: number | null
  sl: number | null
  onlyOneOrder: boolean
  leverage: number
}

export interface TradingInfoResponse {
  highest: number
  lowest: number
  currentPrice: number
  leverages: number[]
}

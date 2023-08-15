export enum PositionSide {
  BOTH = 'BOTH',
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export interface TradingCommandDto {
  symbol: string
  side: PositionSide
  amountUSD: number
  leverage: number
}

export interface TradingInfoResponse {
  highest: number
  lowest: number
  currentPrice: number
  leverages: number[]
  toHighestPercent: number
  toLowestPercent: number
  toHighestLeverage: number
  toLowestLeverage: number
}

export interface FuturesPositionResponse {
  entryPrice: number
  marginType: 'isolated' | 'cross'
  isAutoAddMargin: boolean
  isolatedMargin: number
  leverage: number
  liquidationPrice: number
  markPrice: number
  maxNotionalValue: number
  positionAmt: number
  notional: number
  isolatedWallet: number
  symbol: string
  unRealizedProfit: number
  positionSide: PositionSide
  updateTime: number
}

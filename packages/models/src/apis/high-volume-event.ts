export const enum HighVolumeEvent {
  New = 'new',
}

export interface HighVolumeTicker {
  symbol: string
  volume: number
  volumeInUSDT: string
  priceChange: number
  close: number
  averagePrice: number
  averagePriceDiff: string
}

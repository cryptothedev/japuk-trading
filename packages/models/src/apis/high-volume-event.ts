export const enum HighVolumeEvent {
  New = 'new',
}

export interface HighVolumeTicker {
  symbol: string
  volumeInUSDT: string
  priceChange: number
  close: number
  averagePrice: number
}

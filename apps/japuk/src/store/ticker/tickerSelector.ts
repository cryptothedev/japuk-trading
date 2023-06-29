import { RootState } from '../store'

export class TickerSelector {
  static tickers = (state: RootState) => state.ticker.tickers
  static tickersLoadingStatus = (state: RootState) =>
    state.ticker.tickersLoadingStatus

  static upsertTickerLoadingStatus = (state: RootState) =>
    state.ticker.upsertTickerLoadingStatus

  static deleteTickerLoadingStatus = (state: RootState) =>
    state.ticker.deleteTickerLoadingStatus
}

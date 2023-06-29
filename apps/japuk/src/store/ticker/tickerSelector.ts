import { orderBy } from 'lodash'

import { RootState } from '../store'

export class TickerSelector {
  static tickers = (state: RootState) =>
    orderBy(state.ticker.tickers, [(ticker) => ticker.value], ['desc'])
  static tickersLoadingStatus = (state: RootState) =>
    state.ticker.tickersLoadingStatus

  static upsertTickerLoadingStatus = (state: RootState) =>
    state.ticker.upsertTickerLoadingStatus

  static deleteTickerLoadingStatus = (state: RootState) =>
    state.ticker.deleteTickerLoadingStatus
}

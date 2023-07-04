import { TickerResponse } from '@japuk/models'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { QueryStatus } from '@reduxjs/toolkit/query'

import { TickerService } from '../../services/ticker.service'

export const fetchTickers = createAsyncThunk(
  'ticker/fetchTickers',
  TickerService.fetchTickers,
)

export interface TickerState {
  tickers: TickerResponse[]
  tickersLoadingStatus: QueryStatus
}

const initialState: TickerState = {
  tickers: [],
  tickersLoadingStatus: QueryStatus.uninitialized,
}

export const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    updateTicker: (state, action: PayloadAction<TickerResponse>) => {
      const updatedTicker = action.payload
      const replacingIdx = state.tickers.findIndex(
        (ticker) => ticker.id === updatedTicker.id,
      )
      if (replacingIdx === -1) {
        state.tickers.push(updatedTicker)
        return
      }
      state.tickers[replacingIdx] = updatedTicker
    },
    removeTicker: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.tickers = state.tickers.filter((ticker) => ticker.id !== id)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTickers.pending, (state) => {
      state.tickersLoadingStatus = QueryStatus.pending
    })
    builder.addCase(fetchTickers.rejected, (state) => {
      state.tickersLoadingStatus = QueryStatus.rejected
    })
    builder.addCase(fetchTickers.fulfilled, (state, action) => {
      state.tickersLoadingStatus = QueryStatus.fulfilled

      const { payload } = action
      state.tickers = payload
    })
  },
})

export const tickerReducer = tickerSlice.reducer
export const { updateTicker, removeTicker } = tickerSlice.actions

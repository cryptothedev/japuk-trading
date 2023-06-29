import { TickerResponse } from '@japuk/models'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { QueryStatus } from '@reduxjs/toolkit/query'

import { TickerService } from '../../services/ticker.service'

export const fetchTickers = createAsyncThunk(
  'ticker/fetchTickers',
  TickerService.fetchTickers,
)

export const upsertTicker = createAsyncThunk(
  'ticker/upsertTicker',
  TickerService.upsertTicker,
)

export const deleteTicker = createAsyncThunk(
  'ticker/deleteTicker',
  TickerService.deleteTicker,
)

export interface TickerState {
  tickers: TickerResponse[]
  tickersLoadingStatus: QueryStatus
  upsertTickerLoadingStatus: QueryStatus
  deleteTickerLoadingStatus: QueryStatus
}

const initialState: TickerState = {
  tickers: [],
  tickersLoadingStatus: QueryStatus.uninitialized,
  upsertTickerLoadingStatus: QueryStatus.uninitialized,
  deleteTickerLoadingStatus: QueryStatus.uninitialized,
}

export const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {},
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

    builder.addCase(upsertTicker.pending, (state) => {
      state.upsertTickerLoadingStatus = QueryStatus.pending
    })
    builder.addCase(upsertTicker.rejected, (state) => {
      state.upsertTickerLoadingStatus = QueryStatus.rejected
    })
    builder.addCase(upsertTicker.fulfilled, (state, action) => {
      state.upsertTickerLoadingStatus = QueryStatus.fulfilled

      const { payload } = action

      const replacingIdx = state.tickers.findIndex(
        (ticker) => ticker.id === payload.id,
      )

      if (replacingIdx === -1) {
        state.tickers.push(payload)
        return
      }

      state.tickers[replacingIdx] = payload
    })

    builder.addCase(deleteTicker.pending, (state, action) => {
      state.deleteTickerLoadingStatus = QueryStatus.pending
    })
    builder.addCase(deleteTicker.rejected, (state, action) => {
      state.deleteTickerLoadingStatus = QueryStatus.rejected
    })
    builder.addCase(deleteTicker.fulfilled, (state, action) => {
      state.deleteTickerLoadingStatus = QueryStatus.fulfilled
      const { payload } = action
      state.tickers = state.tickers.filter((ticker) => ticker.id !== payload)
    })
  },
})

export const tickerReducer = tickerSlice.reducer

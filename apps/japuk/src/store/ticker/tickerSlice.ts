import { TickerPriceWs, TickerResponse } from '@japuk/models'
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
    updateTickers: (state, action: PayloadAction<TickerResponse[]>) => {
      const upserteds = action.payload
      const upsertedIds = upserteds.map((upserted) => upserted.id)
      state.tickers = state.tickers
        .filter((ticker) => !upsertedIds.includes(ticker.id))
        .concat(upserteds)
    },
    updateTicker: (state, action: PayloadAction<TickerResponse>) => {
      const updated = action.payload
      const tickerIdx = state.tickers.findIndex(
        (ticker) => ticker.id === updated.id,
      )
      state.tickers = [
        ...state.tickers.slice(0, tickerIdx),
        updated,
        ...state.tickers.slice(tickerIdx + 1),
      ]
    },
    removeTicker: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.tickers = state.tickers.filter((ticker) => ticker.id !== id)
    },
    updatePrices: (
      state,
      action: PayloadAction<Record<string, TickerPriceWs>>,
    ) => {
      const pricesDict = action.payload
      state.tickers.forEach((ticker) => {
        const { pair, amount } = ticker
        if (pricesDict[pair]) {
          const newPrice = pricesDict[pair].close
          ticker.price = newPrice
          ticker.value = amount * newPrice
        }
      })
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
export const { updateTickers, removeTicker, updatePrices, updateTicker } =
  tickerSlice.actions

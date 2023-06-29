import { UpsertTickerDto } from '@japuk/models'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../store/store'
import { TickerSelector } from '../../store/ticker/tickerSelector'
import {
  deleteTicker,
  fetchTickers,
  upsertTicker,
} from '../../store/ticker/tickerSlice'

export const useTicker = (fetch: boolean) => {
  const dispatch = useAppDispatch()
  const tickers = useAppSelector(TickerSelector.tickers)
  const tickersLoadingStatus = useAppSelector(
    TickerSelector.tickersLoadingStatus,
  )
  const upsertTickerLoadingStatus = useAppSelector(
    TickerSelector.upsertTickerLoadingStatus,
  )
  const deleteTickerLoadingStatus = useAppSelector(
    TickerSelector.deleteTickerLoadingStatus,
  )

  useEffect(() => {
    if (fetch) {
      dispatch(fetchTickers())
    }
  }, [dispatch, fetch])

  const upsertIt = (upsertTickerDto: UpsertTickerDto) => {
    dispatch(upsertTicker(upsertTickerDto))
  }

  const deleteIt = (id: string) => {
    dispatch(deleteTicker(id))
  }

  return {
    tickers,
    tickersLoadingStatus,
    upsertTickerLoadingStatus,
    deleteTickerLoadingStatus,
    upsertIt,
    deleteIt,
  }
}
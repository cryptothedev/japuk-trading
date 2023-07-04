import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../store/store'
import { TickerSelector } from '../../store/ticker/tickerSelector'
import { fetchTickers } from '../../store/ticker/tickerSlice'

export const useTicker = (fetch: boolean, polling: boolean) => {
  const dispatch = useAppDispatch()
  const tickers = useAppSelector(TickerSelector.tickers)
  const tickersLoadingStatus = useAppSelector(
    TickerSelector.tickersLoadingStatus,
  )

  useEffect(() => {
    if (fetch) {
      dispatch(fetchTickers())
    }
  }, [dispatch, fetch])

  useEffect(() => {
    let intervalId: NodeJS.Timer

    if (polling) {
      intervalId = setInterval(() => {
        dispatch(fetchTickers())
      }, 7500)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [dispatch, polling])

  return {
    tickers,
    tickersLoadingStatus,
  }
}

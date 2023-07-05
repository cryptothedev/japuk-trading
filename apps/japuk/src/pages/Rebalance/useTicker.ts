import { TickerEvent, TickerPriceWs } from '@japuk/models'
import { useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'

import { BASE_URL } from '../../configs/constants'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { TickerSelector } from '../../store/ticker/tickerSelector'
import { fetchTickers, updatePrices } from '../../store/ticker/tickerSlice'

export const useTicker = (fetch: boolean) => {
  const dispatch = useAppDispatch()
  const tickers = useAppSelector(TickerSelector.tickers)
  const tickersLoadingStatus = useAppSelector(
    TickerSelector.tickersLoadingStatus,
  )

  const refreshTicker = useCallback(() => {
    dispatch(fetchTickers())
  }, [dispatch])

  useEffect(() => {
    if (fetch) {
      refreshTicker()
    }
  }, [fetch, refreshTicker])

  useEffect(() => {
    const wsURL = BASE_URL + '/ticker-prices'
    const socket = io(wsURL)

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('disconnect', () => {
      console.log(socket.id)
    })

    socket.on(
      TickerEvent.Price,
      (pricesDict: Record<string, TickerPriceWs>) => {
        dispatch(updatePrices(pricesDict))
      },
    )

    return () => {
      console.log('disconnect')
      socket.disconnect()
    }
  }, [dispatch])

  return {
    tickers,
    tickersLoadingStatus,
    refreshTicker,
  }
}

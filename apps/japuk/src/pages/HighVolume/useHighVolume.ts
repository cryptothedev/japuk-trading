import { HighVolumeEvent, HighVolumeTicker } from '@japuk/models'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

import { BASE_URL } from '../../configs/constants'

const DELAY_SEC = 5

export const useHighVolume = () => {
  const [tickers, setTickers] = useState<HighVolumeTicker[]>([])

  useEffect(() => {
    let needUpdate = true
    const wsURL = BASE_URL + '/volume-detect'
    const socket = io(wsURL)
    const intervalId = setInterval(() => {
      needUpdate = true
    }, DELAY_SEC * 1000)

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('disconnect', () => {
      console.log(socket.id)
    })

    socket.on(HighVolumeEvent.New, (highVolumeTickers: HighVolumeTicker[]) => {
      if (needUpdate) {
        setTickers(highVolumeTickers)
        needUpdate = false
      }
    })

    return () => {
      console.log('disconnect')
      socket.disconnect()
      clearInterval(intervalId)
    }
  }, [])

  return { tickers }
}

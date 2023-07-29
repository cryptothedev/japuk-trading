import { HighVolumeEvent, HighVolumeTicker } from '@japuk/models'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

import { BASE_URL } from '../../configs/constants'

export const useHighVolume = () => {
  const [tickers, setTickers] = useState<HighVolumeTicker[]>([])
  const [needUpdate, setNeedUpdate] = useState(true)

  useEffect(() => {
    const wsURL = BASE_URL + '/volume-detect'
    const socket = io(wsURL)

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('disconnect', () => {
      console.log(socket.id)
    })

    socket.on(HighVolumeEvent.New, (highVolumeTickers: HighVolumeTicker[]) => {
      if (needUpdate) {
        setTickers(highVolumeTickers)
        setNeedUpdate(false)
      }
    })

    return () => {
      console.log('disconnect')
      socket.disconnect()
    }
  }, [needUpdate])

  return { tickers, refresh: () => setNeedUpdate(true) }
}

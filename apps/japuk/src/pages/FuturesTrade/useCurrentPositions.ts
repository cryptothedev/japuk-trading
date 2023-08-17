import { FuturesPositionResponse } from '@japuk/models'
import { useEffect, useState } from 'react'

import { SmartTradingService } from '../../services/smart-trading.service'

export const useCurrentPositions = () => {
  const [positions, setPositions] = useState<FuturesPositionResponse[]>([])

  const refresh = () => {
    SmartTradingService.getAllPositions().then((positions) =>
      setPositions(positions),
    )
  }

  useEffect(() => {
    refresh()
  }, [])

  return { positions, refresh }
}

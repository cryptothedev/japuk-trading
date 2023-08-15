import { FuturesPositionResponse } from '@japuk/models'
import { useEffect, useState } from 'react'

import { SmartTradingService } from '../../services/smart-trading.service'

export const useCurrentPositions = () => {
  const [positions, setPositions] = useState<FuturesPositionResponse[]>([])

  useEffect(() => {
    SmartTradingService.getAllPositions().then((positions) =>
      setPositions(positions),
    )
  }, [])

  return { positions }
}

import { TradingInfoResponse } from '@japuk/models'
import { useEffect, useState } from 'react'

import { SmartTradingService } from '../../services/smart-trading.service'

export const useSmartTrading = (ticker: string) => {
  const [tradingInfo, setTradingInfo] = useState<TradingInfoResponse>()

  useEffect(() => {
    SmartTradingService.getTradingInfo(ticker).then(setTradingInfo)

    const intervalId = setInterval(() => {
      SmartTradingService.getTradingInfo(ticker).then(setTradingInfo)
    }, 7500)

    return () => {
      clearInterval(intervalId)
    }
  }, [ticker])

  return { tradingInfo }
}

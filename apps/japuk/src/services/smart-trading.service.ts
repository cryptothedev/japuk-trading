import {
  ClosePositionCommandDto,
  FuturesPositionResponse,
  SuccessResponse,
  TradingCommandDto,
  TradingInfoResponse,
} from '@japuk/models'

import { httpClient } from '../configs/httpClient'

export class SmartTradingService {
  static getTradingInfo = (ticker: string) => {
    const url = `/smart-trading/${ticker}`
    return httpClient
      .get<TradingInfoResponse>(url)
      .then((response) => response.data)
  }

  static futuresTrade = (dto: TradingCommandDto) => {
    const url = '/smart-trading/futures-trade'
    return httpClient
      .post<SuccessResponse>(url, dto)
      .then((response) => response.data)
  }

  static closeFutures = (dto: ClosePositionCommandDto) => {
    const url = '/smart-trading/futures-close'
    return httpClient
      .post<SuccessResponse>(url, dto)
      .then((response) => response.data)
  }

  static getAllPositions = () => {
    const url = '/smart-trading/current-position'
    return httpClient
      .get<FuturesPositionResponse[]>(url)
      .then((response) => response.data)
  }
}

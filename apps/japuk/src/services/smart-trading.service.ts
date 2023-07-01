import { TradingInfoResponse } from '@japuk/models'
import axios from 'axios'

import { BASE_URL } from '../configs/constants'

export class SmartTradingService {
  static getTradingInfo = (ticker: string) => {
    const url = BASE_URL + `/smart-trading/${ticker}`
    return axios
      .get<TradingInfoResponse>(url)
      .then((response) => response.data)
  }
}

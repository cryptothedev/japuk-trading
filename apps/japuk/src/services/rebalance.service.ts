import { SuccessResponse, TickerResponse, UpsertTickerDto } from '@japuk/models'
import axios from 'axios'

import { BASE_URL } from '../configs/constants'

export class RebalanceService {
  static rebalanceAll = () => {
    const url = BASE_URL + '/rebalance'
    return axios.post<SuccessResponse>(url).then((response) => response.data)
  }

  static rebalanceOne = (id: string) => {
    const url = BASE_URL + `/rebalance/${id}`
    return axios.post<SuccessResponse>(url).then((response) => response.data)
  }
}

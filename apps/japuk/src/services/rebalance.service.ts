import { SuccessResponse } from '@japuk/models'

import { httpClient } from '../configs/httpClient'

export class RebalanceService {
  static rebalanceAll = () => {
    const url = '/rebalance'
    return httpClient
      .post<SuccessResponse>(url)
      .then((response) => response.data)
  }

  static rebalanceOne = (id: string) => {
    const url = `/rebalance/${id}`
    return httpClient
      .post<SuccessResponse>(url)
      .then((response) => response.data)
  }
}

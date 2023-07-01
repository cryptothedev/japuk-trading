import { TickerResponse, UpsertTickerDto } from '@japuk/models'

import { httpClient } from '../configs/httpClient'

export class TickerService {
  static fetchTickers = () => {
    const url = '/ticker'
    return httpClient
      .get<TickerResponse[]>(url)
      .then((response) => response.data)
  }

  static upsertTicker = (dto: UpsertTickerDto) => {
    const url = '/ticker'
    return httpClient
      .post<TickerResponse>(url, dto)
      .then((response) => response.data)
  }

  static deleteTicker = (id: string) => {
    const url = `/ticker/${id}`
    return httpClient.delete<string>(url).then((response) => response.data)
  }
}

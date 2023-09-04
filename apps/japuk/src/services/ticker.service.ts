import { TickerResponse, UpsertTickersDto } from '@japuk/models'

import { httpClient } from '../configs/httpClient'

export const TickerService = {
  fetchTickers: () => {
    const url = '/ticker'
    return httpClient
      .get<TickerResponse[]>(url)
      .then((response) => response.data)
  },

  upsertTickers: (dto: UpsertTickersDto) => {
    const url = '/ticker'
    return httpClient
      .post<TickerResponse[]>(url, dto)
      .then((response) => response.data)
  },

  toggle: (id: string) => {
    const url = `/ticker/${id}/toggle`
    return httpClient.put<TickerResponse>(url).then((response) => response.data)
  },

  deleteTicker: (id: string) => {
    const url = `/ticker/${id}`
    return httpClient.delete<string>(url).then((response) => response.data)
  },
}

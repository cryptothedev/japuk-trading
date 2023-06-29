import { TickerResponse, UpsertTickerDto } from '@japuk/models'
import axios from 'axios'

import { BASE_URL } from '../configs/constants'

export class TickerService {
  static fetchTickers = () => {
    const url = BASE_URL + '/ticker'
    return axios.get<TickerResponse[]>(url).then((response) => response.data)
  }

  static upsertTicker = (dto: UpsertTickerDto) => {
    const url = BASE_URL + '/ticker'
    return axios
      .post<TickerResponse>(url, dto)
      .then((response) => response.data)
  }

  static deleteTicker = (id: string) => {
    const url = BASE_URL + `/ticker/${id}`
    return axios.delete<string>(url).then((response) => response.data)
  }
}

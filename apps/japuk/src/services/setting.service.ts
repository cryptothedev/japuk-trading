import { SettingResponse, UpsertSettingDto } from '@japuk/models'
import axios from 'axios'

import { BASE_URL } from '../configs/constants'

export class AlertLogService {
  static fetchSetting = () => {
    const url = BASE_URL + '/setting'
    return axios
      .get<SettingResponse | null>(url)
      .then((response) => response.data)
  }

  static upsertSetting = (dto: UpsertSettingDto) => {
    const url = BASE_URL + '/setting'
    return axios
      .post<SettingResponse, UpsertSettingDto>(url, dto)
      .then((response) => response)
  }
}

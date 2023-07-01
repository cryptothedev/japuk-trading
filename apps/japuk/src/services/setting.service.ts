import { SettingResponse, UpsertSettingDto } from '@japuk/models'

import { httpClient } from '../configs/httpClient'

export class SettingService {
  static fetchSetting = () => {
    const url = '/setting'
    return httpClient
      .get<SettingResponse | null>(url)
      .then((response) => response.data)
  }

  static upsertSetting = (dto: UpsertSettingDto) => {
    const url = '/setting'
    return httpClient
      .post<SettingResponse>(url, dto)
      .then((response) => response.data)
  }
}

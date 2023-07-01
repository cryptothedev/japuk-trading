import { AlertLogResponse } from '@japuk/models'

import { httpClient } from '../configs/httpClient'

export class AlertLogService {
  static fetchAlertLogs = (): Promise<AlertLogResponse[]> => {
    const url = '/alert-log'
    return httpClient
      .get<AlertLogResponse[]>(url)
      .then((response) => response.data)
  }

  static dismissAlertLog = (id: string) => {
    const url = `/alert-log/${id}`
    return httpClient
      .patch<AlertLogResponse>(url)
      .then((response) => response.data)
  }
}

import { AlertLogResponse } from '@japuk/models'

import { BASE_URL } from '../configs/constants'

export class AlertLogService {
  static fetchAlertLogs = (): Promise<AlertLogResponse[]> => {
    const url = BASE_URL + '/alert-log'
    return fetch(url).then((response) => response.json())
  }
}

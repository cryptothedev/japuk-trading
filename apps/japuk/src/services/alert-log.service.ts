import { AlertLogResponse } from '@japuk/models'
import axios from 'axios'

import { BASE_URL } from '../configs/constants'

export class AlertLogService {
  static fetchAlertLogs = (): Promise<AlertLogResponse[]> => {
    const url = BASE_URL + '/alert-log'
    return axios.get<AlertLogResponse[]>(url).then((response) => response.data)
  }
}

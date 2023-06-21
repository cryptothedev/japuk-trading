import { AlertLogResponse } from '@japuk/models'

export class AlertLogService {
  static fetchAlertLogs = (): Promise<AlertLogResponse[]> => {
    return fetch(`http://localhost:3000/alert-log`).then((response) =>
      response.json(),
    )
  }
}

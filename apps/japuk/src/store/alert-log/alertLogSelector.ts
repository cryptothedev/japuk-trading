import { RootState } from '../store'

export class AlertLogSelector {
  static alertLogs = (state: RootState) => state.alertLog.alertLogs
  static alertLogsLoadingStatus = (state: RootState) =>
    state.alertLog.alertLogsLoadingStatus
}

import { AlertLogResponse } from '@japuk/models'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { QueryStatus } from '@reduxjs/toolkit/query'

import { AlertLogService } from '../../services/alert-log.service'

export const fetchAlertLogs = createAsyncThunk(
  'alertLog/fetchAlertLogs',
  AlertLogService.fetchAlertLogs,
)

export const dismissAlertLog = createAsyncThunk(
  'alertLog/dismissAlertLog',
  AlertLogService.dismissAlertLog,
)

export interface AlertLogState {
  alertLogs: AlertLogResponse[]
  alertLogsLoadingStatus: QueryStatus
  dismissAlertLogLoadingStatus: QueryStatus
}

const initialState: AlertLogState = {
  alertLogs: [],
  alertLogsLoadingStatus: QueryStatus.uninitialized,
  dismissAlertLogLoadingStatus: QueryStatus.uninitialized,
}

export const alertLogSlice = createSlice({
  name: 'alertLog',
  initialState,
  reducers: {
    addAlertLog: (state, action: PayloadAction<AlertLogResponse>) => {
      const { payload } = action
      state.alertLogs.push(payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAlertLogs.pending, (state) => {
      state.alertLogsLoadingStatus = QueryStatus.pending
    })
    builder.addCase(fetchAlertLogs.rejected, (state) => {
      state.alertLogsLoadingStatus = QueryStatus.rejected
    })
    builder.addCase(fetchAlertLogs.fulfilled, (state, action) => {
      state.alertLogsLoadingStatus = QueryStatus.fulfilled

      const { payload } = action
      state.alertLogs = payload
    })

    builder.addCase(dismissAlertLog.pending, (state) => {
      state.dismissAlertLogLoadingStatus = QueryStatus.pending
    })
    builder.addCase(dismissAlertLog.rejected, (state) => {
      state.dismissAlertLogLoadingStatus = QueryStatus.rejected
    })
    builder.addCase(dismissAlertLog.fulfilled, (state, action) => {
      state.dismissAlertLogLoadingStatus = QueryStatus.fulfilled

      const { payload } = action
      state.alertLogs = state.alertLogs.filter(
        (alertLog) => alertLog.id !== payload.id,
      )
    })
  },
})

export const { addAlertLog } = alertLogSlice.actions

export const alertLogReducer = alertLogSlice.reducer

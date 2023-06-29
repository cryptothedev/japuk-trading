import { AlertLogResponse } from '@japuk/models'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { QueryStatus } from '@reduxjs/toolkit/query'

import { AlertLogService } from '../../services/alert-log.service'

export const fetchAlertLogs = createAsyncThunk(
  'alertLog/fetchAlertLogs',
  AlertLogService.fetchAlertLogs,
)

export interface AlertLogState {
  alertLogs: AlertLogResponse[]
  alertLogsLoadingStatus: QueryStatus
}

const initialState: AlertLogState = {
  alertLogs: [],
  alertLogsLoadingStatus: QueryStatus.uninitialized,
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
  },
})

export const { addAlertLog } = alertLogSlice.actions

export const alertLogReducer = alertLogSlice.reducer

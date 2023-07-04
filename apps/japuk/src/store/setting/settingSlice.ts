import { SettingResponse } from '@japuk/models'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { QueryStatus } from '@reduxjs/toolkit/query'

import { SettingService } from '../../services/setting.service'

export const fetchSetting = createAsyncThunk(
  'setting/fetchSetting',
  SettingService.fetchSetting,
)

export const upsertSetting = createAsyncThunk(
  'setting/upsertSetting',
  SettingService.upsertSetting,
)

export interface SettingState {
  setting: SettingResponse
  settingLoadingStatus: QueryStatus
  upsertSettingLoadingStatus: QueryStatus
}

const initialState: SettingState = {
  setting: { rebalanceToUSD: 0, id: '', futuresAmountUSD: 0 },
  settingLoadingStatus: QueryStatus.uninitialized,
  upsertSettingLoadingStatus: QueryStatus.uninitialized,
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSetting.pending, (state) => {
      state.settingLoadingStatus = QueryStatus.pending
    })
    builder.addCase(fetchSetting.rejected, (state) => {
      state.settingLoadingStatus = QueryStatus.rejected
    })
    builder.addCase(fetchSetting.fulfilled, (state, action) => {
      state.settingLoadingStatus = QueryStatus.fulfilled

      const { payload } = action
      if (payload) {
        state.setting = payload
      }
    })

    builder.addCase(upsertSetting.pending, (state) => {
      state.upsertSettingLoadingStatus = QueryStatus.pending
    })
    builder.addCase(upsertSetting.rejected, (state) => {
      state.upsertSettingLoadingStatus = QueryStatus.rejected
    })
    builder.addCase(upsertSetting.fulfilled, (state, action) => {
      state.upsertSettingLoadingStatus = QueryStatus.fulfilled

      const { payload } = action
      state.setting = payload
    })
  },
})

export const settingReducer = settingSlice.reducer

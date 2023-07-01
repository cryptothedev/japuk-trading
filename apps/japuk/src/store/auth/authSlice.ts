import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { QueryStatus } from '@reduxjs/toolkit/query'

import { AuthService } from '../../services/auth.service'

export const fetchApiToken = createAsyncThunk(
  'auth/fetchApiToken',
  AuthService.fetchApiToken,
)

export interface AuthState {
  apiToken: string | null
  apiTokenLoadingStatus: QueryStatus
}

const initialState: AuthState = {
  apiToken: null,
  apiTokenLoadingStatus: QueryStatus.uninitialized,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchApiToken.pending, (state) => {
      state.apiTokenLoadingStatus = QueryStatus.pending
    })
    builder.addCase(fetchApiToken.rejected, (state) => {
      state.apiTokenLoadingStatus = QueryStatus.rejected
    })
    builder.addCase(fetchApiToken.fulfilled, (state, action) => {
      state.apiTokenLoadingStatus = QueryStatus.fulfilled
      state.apiToken = action.payload
    })
  },
})

export const authReducer = authSlice.reducer

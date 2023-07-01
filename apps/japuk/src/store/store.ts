import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { alertLogReducer } from './alert-log/alertLogSlice'
import { authReducer } from './auth/authSlice'
import { settingReducer } from './setting/settingSlice'
import { tickerReducer } from './ticker/tickerSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alertLog: alertLogReducer,
    setting: settingReducer,
    ticker: tickerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

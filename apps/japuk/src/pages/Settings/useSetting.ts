import { UpsertSettingDto } from '@japuk/models'
import { useEffect } from 'react'

import { SettingSelector } from '../../store/setting/settingSelector'
import { fetchSetting, upsertSetting } from '../../store/setting/settingSlice'
import { useAppDispatch, useAppSelector } from '../../store/store'

export const useSetting = (fetch: boolean) => {
  const dispatch = useAppDispatch()
  const setting = useAppSelector(SettingSelector.setting)
  const settingLoadingStatus = useAppSelector(
    SettingSelector.settingLoadingStatus,
  )
  const upsertSettingLoadingStatus = useAppSelector(
    SettingSelector.upsertSettingLoadingStatus,
  )

  const upsert = (upsertSettingDto: UpsertSettingDto) => {
    dispatch(upsertSetting(upsertSettingDto))
  }

  useEffect(() => {
    if (fetch) {
      dispatch(fetchSetting())
    }
  }, [dispatch, fetch])

  return { setting, settingLoadingStatus, upsertSettingLoadingStatus, upsert }
}

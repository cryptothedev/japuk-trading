import { RootState } from '../store'

export class SettingSelector {
  static setting = (state: RootState) => state.setting.setting
  static settingLoadingStatus = (state: RootState) =>
    state.setting.settingLoadingStatus

  static upsertSettingLoadingStatus = (state: RootState) =>
    state.setting.upsertSettingLoadingStatus
}

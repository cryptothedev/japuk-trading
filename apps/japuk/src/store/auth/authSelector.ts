import { RootState } from '../store'

export class AuthSelector {
  static apiToken = (state: RootState) => state.auth.apiToken
}

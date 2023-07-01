import axios from 'axios'

import { BASE_URL } from '../configs/constants'

export class AuthService {
  static fetchApiToken(password: string) {
    const url = BASE_URL + `/auth/${password}`
    return axios.get<string>(url).then((response) => response.data)
  }
}

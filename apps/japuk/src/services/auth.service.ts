import { httpClient } from '../configs/httpClient'

export class AuthService {
  static fetchApiToken(password: string) {
    const url = `/auth/${password}`
    return httpClient.get<string>(url).then((response) => response.data)
  }
}

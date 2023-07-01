import axios from 'axios'

import { BASE_URL } from './constants'

export const API_TOKEN = 'apiToken'

export const httpClient = axios.create({ baseURL: BASE_URL })
httpClient.interceptors.request.use((config) => {
  config.headers['japuk-api-token'] = sessionStorage.getItem(API_TOKEN)
  return config
})

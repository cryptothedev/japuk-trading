import { Injectable } from '@nestjs/common'

@Injectable()
export class LogService {
  info = console.log.bind(console)
  error = console.error.bind(console)
}

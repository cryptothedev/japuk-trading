import { Injectable } from '@nestjs/common'

@Injectable()
export class LogService {
  log = console.log.bind(console)
}

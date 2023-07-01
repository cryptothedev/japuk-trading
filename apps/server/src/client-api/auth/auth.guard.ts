import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import * as process from 'process'
import { Observable } from 'rxjs'

import { ConfigService } from '../../core/config.service'

const NO_AUTH_PATHS = ['/auth', 'tradingview-webhook']

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request
    const { path, headers } = request

    if (NO_AUTH_PATHS.some((noAuthPath) => path.includes(noAuthPath))) {
      return true
    }

    const apiToken = headers['japuk-api-token']

    return apiToken === this.configService.getWebAppTokenConfig().apiToken
  }
}

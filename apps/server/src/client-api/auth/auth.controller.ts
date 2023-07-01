import { Controller, ForbiddenException, Get, Param } from '@nestjs/common'

import { ConfigService } from '../../core/config.service'

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}
  @Get(':webPassword')
  getApiToken(@Param('webPassword') toCheckWebPassword: string) {
    const { webPassword, apiToken } = this.configService.getWebAppTokenConfig()
    if (toCheckWebPassword !== webPassword) {
      throw new ForbiddenException()
    }
    return apiToken
  }
}

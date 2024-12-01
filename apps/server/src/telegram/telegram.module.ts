import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { TelegramBotService } from './telegram-bot.service'
import { TelegramClientService } from './telegram-client.service'

@Module({
  imports: [CoreModule],
  providers: [TelegramClientService, TelegramBotService],
  exports: [TelegramClientService, TelegramBotService],
})
export class TelegramModule {}

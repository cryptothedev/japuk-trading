import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { TelegramClientService } from './telegram-client.service'
import { TelegramBotService } from './telegram-bot.service';

@Module({
  imports: [CoreModule],
  providers: [TelegramClientService, TelegramBotService],
  exports: [TelegramClientService, TelegramBotService],
})
export class TelegramModule {}

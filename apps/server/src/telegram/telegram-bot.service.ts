import { Injectable } from '@nestjs/common'
import { Telegraf } from 'telegraf'

import { ConfigService } from '../core/config.service'

@Injectable()
export class TelegramBotService {
  private client: Telegraf

  constructor(private configService: ConfigService) {
    this.client = new Telegraf(this.configService.getTgBotToken())

    this.startBot()
  }

  private async startBot() {
    await this.client.launch()

    process.once('SIGINT', () => this.client.stop('SIGINT'))
    process.once('SIGTERM', () => this.client.stop('SIGTERM'))
  }

  async sendMessage(message: string, chatId: string, threadId: number) {
    await this.client.telegram
      .sendMessage(chatId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        message_thread_id: threadId,
      })
      .catch((error) => console.error(error))
  }
}

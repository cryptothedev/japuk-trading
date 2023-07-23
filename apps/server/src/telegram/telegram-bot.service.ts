import { Injectable } from '@nestjs/common'
import { Telegraf } from 'telegraf'

import { ConfigService } from '../core/config.service'

@Injectable()
export class TelegramBotService {
  private client: Telegraf | undefined

  constructor(private configService: ConfigService) {
    const botToken = this.configService.getTgBotToken()
    if (!botToken) {
      return
    }

    this.startBot(botToken)
  }

  async sendMessage(message: string, chatId: string, threadId: number) {
    if (!this.client) {
      return
    }

    await this.client.telegram
      .sendMessage(chatId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        message_thread_id: threadId,
      })
      .catch((error) => console.error(error))
  }

  private async startBot(botToken: string) {
    const client = new Telegraf(botToken)
    await client.launch()
    process.once('SIGINT', () => client.stop('SIGINT'))
    process.once('SIGTERM', () => client.stop('SIGTERM'))

    this.client = client
  }
}

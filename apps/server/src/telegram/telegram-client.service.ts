import { Injectable } from '@nestjs/common'
import { Api, TelegramClient } from 'telegram'
import { generateRandomBytes, sha256 } from 'telegram/Helpers'
import { UserAuthParams } from 'telegram/client/auth'
import { StringSession } from 'telegram/sessions'

import { ConfigService } from '../core/config.service'
import { LogService } from '../core/log.service'
import { int256ToBytes } from './utils/int256ToBytes'

@Injectable()
export class TelegramClientService {
  private client: TelegramClient

  constructor(
    private configService: ConfigService,
    private logger: LogService,
  ) {
    this.initClient()
  }

  async callToAlert(alertMessage: string) {
    await this.client.invoke(
      new Api.phone.RequestCall({
        video: false,
        userId: this.configService.getTgClientConfig().alertUserId,
        randomId: Math.floor(Math.random() * 10000),
        gAHash: await this.getShagA(),
        protocol: new Api.PhoneCallProtocol({
          minLayer: 92,
          maxLayer: 92,
          libraryVersions: ['3.0.0'],
          udpP2p: true,
          udpReflector: true,
        }),
      }),
    )

    await this.client.sendMessage('@cryptodevthai', {
      message: alertMessage,
    })
  }

  private async initClient() {
    const {
      apiId,
      apiHash,
      stringSession: stringSessionString,
      phoneNumber,
    } = this.configService.getTgClientConfig()

    if (!stringSessionString) {
      return
    }

    const stringSession = new StringSession(stringSessionString)

    this.client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    })

    await this.client.start({
      phoneNumber: phoneNumber,
      onError: (err) => this.logger.error(err),
    } as UserAuthParams)

    this.logger.info('Telegram client started.')
    this.client.session.save()
  }

  private async getShagA() {
    const dhc = (await this.client.invoke(
      new Api.messages.GetDhConfig({
        version: 0,
        randomLength: 256,
      }),
    )) as any

    const g = BigInt(dhc.g)
    const p = BigInt(`0x${dhc.p.toString('hex')}`)

    let a = BigInt(0)
    while (a <= 1 && a >= p) {
      a = BigInt(`0x${generateRandomBytes(256).toString('hex')}`)
    }

    const g_a = g ** a % p

    return await sha256(int256ToBytes(g_a))
  }
}

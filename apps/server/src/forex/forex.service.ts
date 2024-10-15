import { Injectable } from '@nestjs/common'
import MetaApi, { MetatraderAccount } from 'metaapi.cloud-sdk'
import RpcMetaApiConnectionInstance from 'metaapi.cloud-sdk/dist/metaApi/rpcMetaApiConnectionInstance'

import { ConfigService } from '../core/config.service'

@Injectable()
export class ForexService {
  connection: RpcMetaApiConnectionInstance

  constructor(private configService: ConfigService) {}

  async initConnection() {
    const { token, accountId } = this.configService.getForexMetaApiConfig()

    const api: MetaApi = new MetaApi(token)
    const account: MetatraderAccount =
      await api.metatraderAccountApi.getAccount(accountId)
    this.connection = account.getRPCConnection()
    await this.connection.connect()
    await this.connection.waitSynchronized()
  }

  async marketBuyOrder(
    symbol: string,
    lot: number,
    pipSl: number,
    // pipTp: number,
  ) {
    const specification = await this.connection.getSymbolSpecification(symbol)
    const pipSize = Math.pow(10, -specification.digits)
    const price = await this.connection.getSymbolPrice(symbol, false)
    const currentPrice = price.bid
    const stopLoss = currentPrice - pipSl * pipSize
    // const takeProfit = currentPrice + pipTp * pipSize
    await this.connection.createMarketBuyOrder(symbol, lot, stopLoss)
  }

  async marketSellOrder(
    symbol: string,
    lot: number,
    pipSl: number,
    // pipTp: number,
  ) {
    const specification = await this.connection.getSymbolSpecification(symbol)
    const pipSize = Math.pow(10, -specification.digits)
    const price = await this.connection.getSymbolPrice(symbol, false)
    const currentPrice = price.ask
    const stopLoss = currentPrice + pipSl * pipSize
    // const takeProfit = currentPrice - pipTp * pipSize
    await this.connection.createMarketSellOrder(symbol, lot, stopLoss)
  }
}

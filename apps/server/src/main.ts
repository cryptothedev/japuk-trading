import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'

import { AppModule } from './app.module'
import { ForexService } from './forex/forex.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  app.use('/tradingview-webhook', bodyParser.text())

  // await app.get(ForexService).initConnection()

  await app.listen(3005)
}
bootstrap()

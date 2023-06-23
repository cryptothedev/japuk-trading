import { NestFactory } from '@nestjs/core'
import * as bodyParser from 'body-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  app.use('/tradingview-webhook', bodyParser.text())

  await app.listen(3003)
}
bootstrap()

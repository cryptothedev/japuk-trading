import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CoreModule } from '../core/core.module'
import { AlertLogRepo } from './alert-log/alert-log.repo'
import { AlertLog, AlertLogSchema } from './alert-log/alert-log.schema'
import { MongooseConfigService } from './mongoose-config.service'
import { SettingRepo } from './setting/setting.repo'
import { Setting, SettingSchema } from './setting/setting.schema'
import { TickerRepo } from './ticker/ticker.repo'
import { Ticker, TickerSchema } from './ticker/ticker.schema'

@Module({
  imports: [
    CoreModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      imports: [CoreModule],
    }),
    MongooseModule.forFeature([
      { name: AlertLog.name, schema: AlertLogSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: Ticker.name, schema: TickerSchema },
    ]),
  ],
  providers: [MongooseConfigService, AlertLogRepo, SettingRepo, TickerRepo],
  exports: [AlertLogRepo, SettingRepo, TickerRepo],
})
export class DatabaseModule {}

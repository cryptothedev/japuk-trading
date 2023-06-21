import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CoreModule } from '../core/core.module'
import { AlertLogRepo } from './alert-log-repo'
import { AlertLog, AlertLogSchema } from './alert-log.schema'
import { MongooseConfigService } from './mongoose-config.service'

@Module({
  imports: [
    CoreModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      imports: [CoreModule],
    }),
    MongooseModule.forFeature([
      { name: AlertLog.name, schema: AlertLogSchema },
    ]),
  ],
  providers: [MongooseConfigService, AlertLogRepo],
  exports: [AlertLogRepo],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common'

import { CoreModule } from '../core/core.module'
import { ForexService } from './forex.service'

@Module({
  imports: [CoreModule],
  providers: [ForexService],
  exports: [ForexService],
})
export class ForexModule {}

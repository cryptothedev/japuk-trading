import { Module } from '@nestjs/common'

import { BinanceModule } from './binance/binance.module'
import { ClientApiModule } from './client-api/client-api.module'
import { CoreModule } from './core/core.module'
import { DatabaseModule } from './database/database.module'
import { TradingviewModule } from './tradingview/tradingview.module'

@Module({
  imports: [
    CoreModule,
    DatabaseModule,
    BinanceModule,
    TradingviewModule,
    ClientApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

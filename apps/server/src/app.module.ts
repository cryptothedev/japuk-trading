import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { BinanceModule } from './binance/binance.module'
import { AuthGuard } from './client-api/auth/auth.guard'
import { ClientApiModule } from './client-api/client-api.module'
import { CoreModule } from './core/core.module'
import { DatabaseModule } from './database/database.module'
import { ForexModule } from './forex/forex.module'
import { TelegramModule } from './telegram/telegram.module'
import { TradingviewModule } from './tradingview/tradingview.module'

@Module({
  imports: [
    CoreModule,
    DatabaseModule,
    BinanceModule,
    TradingviewModule,
    ClientApiModule,
    TelegramModule,
    ForexModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

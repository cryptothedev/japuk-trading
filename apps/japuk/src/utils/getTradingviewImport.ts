import { sortBy } from 'lodash'

const WATCH_LIST = ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'OTHERS.D', 'BTC.D']

export const getTradingViewImport = (symbols: string[], withDefault = true) => {
  return (withDefault ? WATCH_LIST : [])
    .concat(sortBy(symbols).map((symbol) => `BINANCE:${symbol}`))
    .join(',')
}

import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { TickerResponse } from '@japuk/models'

import { RebalanceTicker } from './RebalanceTicker'

interface RebalanceTickersProps {
  tickers: TickerResponse[]
  deleteTicker: (id: string) => void
  rebalanceToUSD: number
}
export const RebalanceTickers = ({
  tickers,
  deleteTicker,
  rebalanceToUSD,
}: RebalanceTickersProps) => {
  return (
    <Table variant="striped">
      <Thead>
        <Tr>
          <Th>Pair</Th>
          <Th>Amount</Th>
          <Th>Price ($)</Th>
          <Th>Value ($)</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {tickers.map((ticker) => {
          return (
            <RebalanceTicker
              key={ticker.id}
              ticker={ticker}
              rebalanceToUSD={rebalanceToUSD}
              deleteTicker={deleteTicker}
            />
          )
        })}
      </Tbody>
    </Table>
  )
}

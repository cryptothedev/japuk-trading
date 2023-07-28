import { Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { getTradingViewImport } from '../../utils/getTradingviewImport'
import { useHighVolume } from './useHighVolume'

export const HighVolume = () => {
  const { tickers } = useHighVolume()

  const tradingviewImport = getTradingViewImport(
    tickers.map((ticker) => ticker.symbol),
    false,
  )

  return (
    <>
      <PageHeader
        title="High Volume"
        description="High volume tickers with more than 5% change"
      />
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Coin</Th>
            <Th>Volume</Th>
            <Th>Price Change(%)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tickers.map((ticker) => {
            const { symbol, volumeInUSDT, priceChange } = ticker

            return (
              <Tr key={symbol}>
                <Td>{symbol}</Td>
                <Td>{volumeInUSDT}</Td>
                <Td>{priceChange}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>

      <Text mt={8}>{tradingviewImport}</Text>
    </>
  )
}

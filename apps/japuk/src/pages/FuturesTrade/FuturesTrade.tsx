import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { getTradingViewImport } from '../../utils/getTradingviewImport'
import { useCurrentPositions } from './useCurrentPositions'

export const FuturesTrade = () => {
  const { positions } = useCurrentPositions()

  const tradingviewImport = getTradingViewImport(
    positions.map((position) => position.symbol),
    false,
  )

  console.log(positions)

  return (
    <>
      <Flex justifyContent="space-between">
        <PageHeader
          title="High Volume"
          description="High volume tickers in the past 24hrs"
        />
      </Flex>

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Coin</Th>
            <Th>Side</Th>
            <Th>Margin ($)</Th>
            <Th>Unrealized Profit($)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {positions.map((positions) => {
            const { symbol, positionSide, isolatedWallet, unRealizedProfit } =
              positions

            return (
              <Tr key={symbol}>
                <Td>{symbol}</Td>
                <Td>{positionSide}</Td>
                <Td>{isolatedWallet.toLocaleString()}</Td>
                <Td>{unRealizedProfit.toLocaleString()}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>

      <Text mt={8}>{tradingviewImport}</Text>
    </>
  )
}

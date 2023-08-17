import {
  Flex,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { RiRefreshLine } from 'react-icons/ri'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { getTradingViewImport } from '../../utils/getTradingviewImport'
import { useHighVolume } from './useHighVolume'

export const HighVolume = () => {
  const { tickers, refresh } = useHighVolume()

  const tradingviewImport = getTradingViewImport(
    tickers.map((ticker) => ticker.symbol),
    false,
  )

  return (
    <>
      <Flex justifyContent="space-between">
        <PageHeader
          title="High Volume"
          description="High volume tickers in the past 24hrs"
        />
        <HStack spacing={6} alignSelf="flex-end">
          <IconButton
            icon={<RiRefreshLine fontSize="1.25rem" />}
            variant="outline"
            aria-label="refresh tickers"
            onClick={refresh}
          />
        </HStack>
      </Flex>

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Coin</Th>
            <Th>Volume</Th>
            <Th>Price Change(%)</Th>
            <Th>Average Diff(%)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tickers.map((ticker) => {
            const { symbol, volumeInUSDT, priceChange, averagePriceDiff } =
              ticker

            return (
              <Tr key={symbol}>
                <Td>{symbol}</Td>
                <Td>{volumeInUSDT}</Td>
                <Td>{priceChange}</Td>
                <Td>{averagePriceDiff}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>

      <Text mt={8}>{tradingviewImport}</Text>
    </>
  )
}

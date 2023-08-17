import {
  Box,
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
import { useEffect, useState } from 'react'
import { GoCloudDownload, GoCloudUpload } from 'react-icons/go'
import { RiRefreshLine } from 'react-icons/ri'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { SmartTradingService } from '../../services/smart-trading.service'
import { getTradingViewImport } from '../../utils/getTradingviewImport'
import { useSetting } from '../Settings/useSetting'
import { useCurrentPositions } from './useCurrentPositions'

export const FuturesTrade = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { positions, refresh } = useCurrentPositions()
  const { setting } = useSetting(false)

  useEffect(() => {
    const intervalId = setInterval(refresh, 3000)
    return () => clearInterval(intervalId)
  }, [refresh])

  const { maxLeverage, futuresAmountUSD } = setting

  const tradingviewImport = getTradingViewImport(
    positions.map((position) => position.symbol),
    false,
  )

  const numPositions = positions.length
  const totalUSD = positions.reduce(
    (sum, position) => sum + position.isolatedWallet,
    0,
  )
  const gain = positions.reduce(
    (gain, position) => gain + position.unRealizedProfit,
    0,
  )

  const dcaAll = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all(
        positions.map((position) => {
          const { symbol, positionSide } = position
          return SmartTradingService.futuresTrade({
            symbol,
            side: positionSide,
            leverage: maxLeverage,
            amountUSD: futuresAmountUSD,
          })
        }),
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <>
      <Flex justifyContent="space-between">
        <PageHeader
          title="High Volume"
          description="High volume tickers in the past 24hrs"
        />

        <Box>
          <Text>
            <b>{numPositions}</b> positions
          </Text>
          <Text>
            Total <b>${totalUSD.toLocaleString()}</b>
          </Text>
          <Text color={gain > 0 ? 'primary.500' : 'danger.500'}>
            <b>(${gain.toLocaleString()})</b>
          </Text>
        </Box>

        <HStack spacing={6} alignSelf="flex-end">
          <IconButton
            icon={<RiRefreshLine fontSize="1.25rem" />}
            variant="outline"
            aria-label="refresh tickers"
            onClick={refresh}
          />
          <IconButton
            icon={<GoCloudUpload fontSize="1.25rem" />}
            variant="solid"
            colorScheme="primary"
            aria-label="rebalance"
            onClick={dcaAll}
            isLoading={isRefreshing}
          />
          <IconButton
            icon={<GoCloudDownload fontSize="1.25rem" />}
            variant="solid"
            colorScheme="danger"
            aria-label="rebalance"
            onClick={dcaAll}
            isLoading={isRefreshing}
          />
        </HStack>
      </Flex>

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Coin</Th>
            <Th>Side</Th>
            <Th>Margin ($)</Th>
            <Th>Unrealized($)</Th>
            <Th>Unrealized(%)</Th>
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
                <Td>
                  {((unRealizedProfit * 100) / isolatedWallet).toLocaleString()}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>

      <Text mt={8}>{tradingviewImport}</Text>
    </>
  )
}

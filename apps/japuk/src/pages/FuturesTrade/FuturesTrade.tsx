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
import { BsDoorClosed, BsDoorOpen } from 'react-icons/bs'
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
          }).catch((err) => console.log(err))
        }),
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  const closeAll = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all(
        positions.map((position) => {
          const { symbol, positionSide, isolatedWallet, positionAmt } = position
          const afterDot = String(positionAmt).split('.')[1]
          const decimals = afterDot ? afterDot.length : 0
          return SmartTradingService.closeFutures({
            symbol,
            side: positionSide,
            amount: Number(
              Math.abs(
                (positionAmt * futuresAmountUSD) / isolatedWallet,
              ).toFixed(decimals),
            ),
          }).catch((err) => console.log(err))
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
          title="Day Trade"
          description="Try to close all positions in one day"
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
            icon={<BsDoorOpen fontSize="1.25rem" />}
            variant="solid"
            colorScheme="primary"
            aria-label="rebalance"
            onClick={dcaAll}
            isLoading={isRefreshing}
          />
          <IconButton
            icon={<BsDoorClosed fontSize="1.25rem" />}
            variant="solid"
            colorScheme="danger"
            aria-label="rebalance"
            onClick={closeAll}
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

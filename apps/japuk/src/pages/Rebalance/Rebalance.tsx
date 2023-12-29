import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { UpsertTickersDto } from '@japuk/models'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { useState } from 'react'
import { MdPause, MdPlayArrow } from 'react-icons/md'
import { RiAddFill, RiRefreshLine } from 'react-icons/ri'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { RebalanceService } from '../../services/rebalance.service'
import { TickerService } from '../../services/ticker.service'
import { useAppDispatch } from '../../store/store'
import { removeTicker, updateTickers } from '../../store/ticker/tickerSlice'
import { getTradingViewImport } from '../../utils/getTradingviewImport'
import { wait } from '../../utils/wait'
import { useSetting } from '../Settings/useSetting'
import { AddTickerModal } from './AddTickerModal'
import { RebalanceIcon } from './RebalanceIcon'
import { RebalanceTickers } from './RebalanceTickers'
import { useTicker } from './useTicker'

export const Rebalance = () => {
  const [isRebalancing, setIsRebalancing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const {
    tickers,
    refreshTicker,
    tickersLoadingStatus,
    fetchingPrice,
    setFetchingPrice,
  } = useTicker(true)
  const { setting } = useSetting(true)

  const {
    isOpen: isAddTickerModalOpen,
    onOpen: onOpenAddTickerModal,
    onClose: onCloseAddTickerModal,
  } = useDisclosure()

  const rebalanceAll = async () => {
    setIsRebalancing(true)
    await RebalanceService.rebalanceAll()
    await wait(3)
    setIsRebalancing(false)
    refreshTicker()
  }

  const { rebalanceToUSD } = setting

  const numTickers = tickers.length
  const totalValue = tickers.reduce((total, ticker) => total + ticker.value, 0)
  const gain = totalValue - rebalanceToUSD * numTickers

  const tradingviewImport = getTradingViewImport(
    tickers.map((ticker) => ticker.pair),
  )

  const handleDeleteTicker = async (id: string) => {
    await TickerService.deleteTicker(id)
    dispatch(removeTicker(id))
    refreshTicker()
  }

  const handleUpsertTicker = async (upsertTickersDto: UpsertTickersDto) => {
    setIsLoading(true)
    const upserteds = await TickerService.upsertTickers(upsertTickersDto)
    dispatch(updateTickers(upserteds))
    setIsLoading(false)
    refreshTicker()
  }

  const isFetching = tickersLoadingStatus === QueryStatus.pending

  return (
    <>
      <Flex justifyContent="space-between">
        <PageHeader
          title="Rebalance"
          description="Tools to take make it easy for rebalancing"
        />

        <Box>
          <Text>
            <b>{numTickers}</b> pairs
          </Text>
          <Text>
            Each to <b>${rebalanceToUSD.toLocaleString()}</b>
          </Text>
          <Text>
            Total <b>${totalValue.toLocaleString()}</b>
          </Text>
          <Text color={gain > 0 ? 'primary.500' : 'danger.500'}>
            <b>(${gain.toLocaleString()})</b>
          </Text>
        </Box>

        <HStack spacing={6} alignSelf="flex-end">
          <IconButton
            icon={
              fetchingPrice ? (
                <MdPause fontSize="1.25rem" />
              ) : (
                <MdPlayArrow fontSize="1.25rem" />
              )
            }
            variant="solid"
            aria-label="add ticker"
            colorScheme="blue"
            onClick={() => setFetchingPrice(!fetchingPrice)}
          />

          <IconButton
            icon={<RiRefreshLine fontSize="1.25rem" />}
            variant="outline"
            aria-label="refresh tickers"
            onClick={refreshTicker}
            isLoading={isFetching}
          />
          <RebalanceIcon
            gain={gain}
            onClick={rebalanceAll}
            isRebalancing={isRebalancing || isFetching}
          />
          <IconButton
            icon={<RiAddFill fontSize="1.25rem" />}
            variant="outline"
            aria-label="add ticker"
            onClick={onOpenAddTickerModal}
          />
        </HStack>
      </Flex>

      <RebalanceTickers
        tickers={tickers}
        deleteTicker={handleDeleteTicker}
        rebalanceToUSD={setting.rebalanceToUSD}
        refreshTicker={refreshTicker}
        isFetching={isFetching}
      />

      {isAddTickerModalOpen && (
        <AddTickerModal
          upsertTicker={handleUpsertTicker}
          isLoading={isLoading || isFetching}
          isOpen={isAddTickerModalOpen}
          onClose={onCloseAddTickerModal}
        />
      )}

      <Text mt={8}>{tradingviewImport}</Text>
    </>
  )
}

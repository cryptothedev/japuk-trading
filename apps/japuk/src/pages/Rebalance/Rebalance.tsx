import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { FaBalanceScaleLeft } from 'react-icons/fa'
import { FiRefreshCw } from 'react-icons/fi'
import { RiAddFill } from 'react-icons/ri'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { useSetting } from '../Settings/useSetting'
import { AddTickerModal } from './AddTickerModal'
import { RebalanceTickers } from './RebalanceTickers'
import { useTicker } from './useTicker'

export const Rebalance = () => {
  const { tickers, upsertIt, deleteIt, upsertTickerLoadingStatus } =
    useTicker(false)
  const { setting } = useSetting(false)

  const {
    isOpen: isAddTickerModalOpen,
    onOpen: onOpenAddTickerModal,
    onClose: onCloseAddTickerModal,
  } = useDisclosure()

  const { rebalanceToUSD } = setting

  const numTickers = tickers.length
  const totalValue = tickers.reduce((total, ticker) => total + ticker.value, 0)
  const gain = totalValue - 8000 * numTickers

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

        <HStack spacing={2} alignSelf="flex-end">
          <IconButton
            icon={<FaBalanceScaleLeft fontSize="1.25rem" />}
            variant="solid"
            aria-label="rebalance"
          />
          <IconButton
            icon={<FiRefreshCw fontSize="1.25rem" />}
            variant="ghost"
            aria-label="refresh"
          />
          <IconButton
            icon={<RiAddFill fontSize="1.25rem" />}
            variant="outline"
            aria-label="add ticker"
            onClick={onOpenAddTickerModal}
          />
        </HStack>
      </Flex>

      <RebalanceTickers tickers={tickers} deleteTicker={deleteIt} />

      {isAddTickerModalOpen && (
        <AddTickerModal
          upsertTicker={upsertIt}
          upsertTickerLoadingStatus={upsertTickerLoadingStatus}
          isOpen={isAddTickerModalOpen}
          onClose={onCloseAddTickerModal}
        />
      )}
    </>
  )
}

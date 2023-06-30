import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { RiAddFill } from 'react-icons/ri'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { RebalanceService } from '../../services/rebalance.service'
import { useSetting } from '../Settings/useSetting'
import { AddTickerModal } from './AddTickerModal'
import { RebalanceIcon } from './RebalanceIcon'
import { RebalanceTickers } from './RebalanceTickers'
import { useTicker } from './useTicker'

export const Rebalance = () => {
  const [isRebalancing, setIsRebalancing] = useState(false)

  const { tickers, upsertIt, deleteIt, upsertTickerLoadingStatus } =
    useTicker(false)
  const { setting } = useSetting(false)

  const {
    isOpen: isAddTickerModalOpen,
    onOpen: onOpenAddTickerModal,
    onClose: onCloseAddTickerModal,
  } = useDisclosure()

  const rebalanceAll = async () => {
    setIsRebalancing(true)
    await RebalanceService.rebalanceAll()
    setIsRebalancing(false)
  }

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

        <HStack spacing={6} alignSelf="flex-end">
          <RebalanceIcon
            gain={gain}
            onClick={rebalanceAll}
            isDisabled={isRebalancing}
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
        deleteTicker={deleteIt}
        rebalanceToUSD={setting.rebalanceToUSD}
      />

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

import { HStack, IconButton, Td, Tr } from '@chakra-ui/react'
import { TickerResponse } from '@japuk/models'
import { useState } from 'react'
import { MdDelete } from 'react-icons/md'

import { RebalanceService } from '../../services/rebalance.service'
import { RebalanceIcon } from './RebalanceIcon'

interface RebalanceTickerProps {
  ticker: TickerResponse
  rebalanceToUSD: number
  isFetching: boolean
  deleteTicker: (id: string) => void
  refreshTicker: () => void
}

export const RebalanceTicker = ({
  ticker,
  rebalanceToUSD,
  isFetching,
  deleteTicker,
  refreshTicker,
}: RebalanceTickerProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleDelete = (id: string) => {
    deleteTicker(id)
  }

  const rebalance = async (id: string) => {
    setIsLoading(true)
    await RebalanceService.rebalanceOne(id)
    setIsLoading(false)
    refreshTicker()
  }

  const { id, pair, amount, price, value } = ticker
  const gain = value - rebalanceToUSD

  return (
    <Tr>
      <Td>{pair}</Td>
      <Td>{amount}</Td>
      <Td>{price}</Td>
      <Td>{value.toLocaleString()}</Td>
      <Td>
        <HStack spacing="6">
          <RebalanceIcon
            gain={gain}
            onClick={() => rebalance(id)}
            isRebalancing={isLoading || isFetching}
          />
          <IconButton
            icon={<MdDelete fontSize="1.25rem" />}
            variant="ghost"
            aria-label="delete"
            colorScheme="black"
            onClick={() => handleDelete(id)}
          />
        </HStack>
      </Td>
    </Tr>
  )
}

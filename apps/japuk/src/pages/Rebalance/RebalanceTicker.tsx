import { Checkbox, HStack, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { TickerResponse } from '@japuk/models'
import { useState } from 'react'
import { MdDelete } from 'react-icons/md'

import { RebalanceService } from '../../services/rebalance.service'
import { TickerService } from '../../services/ticker.service'
import { useAppDispatch } from '../../store/store'
import { updateTicker } from '../../store/ticker/tickerSlice'
import { wait } from '../../utils/wait'
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
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const handleDelete = (id: string) => {
    deleteTicker(id)
  }

  const rebalance = async (id: string) => {
    setIsLoading(true)
    await RebalanceService.rebalanceOne(id)
    await wait(3)
    setIsLoading(false)
    refreshTicker()
  }

  const toggleTicker = async (id: string) => {
    setIsLoading(true)
    const toggled = await TickerService.toggle(id)
    dispatch(updateTicker(toggled))
    setIsLoading(false)
  }

  const { id, pair, value, isDisabled, gains } = ticker
  const gain = value - rebalanceToUSD

  console.log(gains)

  return (
    <Tr>
      <Td>{pair}</Td>
      <Td>{value.toLocaleString()}</Td>
      <Td>
        <HStack>
          <Text color={gain > 0 ? 'primary.500' : 'danger.500'}>
            <b>{Math.abs(gain).toFixed(0)}</b>
          </Text>
          <Text>|</Text>
          {[...gains]
            .reverse()
            .slice(0, 10)
            .map((gain) => {
              return (
                <Text color={gain > 0 ? 'primary.500' : 'danger.500'}>
                  <b>{Math.abs(gain).toFixed(0)}</b>
                </Text>
              )
            })}
        </HStack>
      </Td>
      <Td>
        <HStack spacing="6">
          <Checkbox
            isChecked={!isDisabled}
            onChange={() => toggleTicker(id)}
            isDisabled={isLoading || isFetching}
          />
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

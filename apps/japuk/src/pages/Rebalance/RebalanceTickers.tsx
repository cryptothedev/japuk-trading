import {
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { TickerResponse } from '@japuk/models'
import { MdDelete } from 'react-icons/md'

import { RebalanceService } from '../../services/rebalance.service'
import { RebalanceIcon } from './RebalanceIcon'

interface RebalanceTickersProps {
  tickers: TickerResponse[]
  deleteTicker: (id: string) => void
  rebalanceToUSD: number
}
export const RebalanceTickers = ({
  tickers,
  deleteTicker,
  rebalanceToUSD,
}: RebalanceTickersProps) => {
  const handleDelete = (id: string) => {
    deleteTicker(id)
  }

  const rebalance = async (id: string) => {
    console.log('test')
    await RebalanceService.rebalanceOne(id)
  }

  return (
    <Table variant="striped">
      <Thead>
        <Tr>
          <Th>Pair</Th>
          <Th>Amount</Th>
          <Th>Price ($)</Th>
          <Th>Value ($)</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {tickers.map((ticker) => {
          const { id, pair, amount, price, value } = ticker
          const gain = value - rebalanceToUSD
          return (
            <Tr key={id}>
              <Td>{pair}</Td>
              <Td>{amount}</Td>
              <Td>{price}</Td>
              <Td>{value.toLocaleString()}</Td>
              <Td>
                <HStack spacing="6">
                  <RebalanceIcon gain={gain} onClick={() => rebalance(id)} />
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
        })}
      </Tbody>
    </Table>
  )
}

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
import {
  FaBalanceScale,
  FaBalanceScaleLeft,
  FaBalanceScaleRight,
} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

interface RebalanceTickersProps {
  tickers: TickerResponse[]
  deleteTicker: (id: string) => void
}
export const RebalanceTickers = ({
  tickers,
  deleteTicker,
}: RebalanceTickersProps) => {
  const handleDelete = (id: string) => {
    deleteTicker(id)
  }

  return (
    <Table variant="striped">
      <Thead>
        <Tr>
          <Th>Pair</Th>
          <Th>Value ($)</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {tickers.map((ticker) => {
          const { id, name } = ticker
          return (
            <Tr key={id}>
              <Td>{name}</Td>
              <Td>{id}</Td>
              <Td>
                <HStack spacing="4">
                  <IconButton
                    icon={<FaBalanceScaleRight fontSize="1.25rem" />}
                    variant="solid"
                    aria-label="rebalance"
                    colorScheme="danger"
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
        })}
      </Tbody>
    </Table>
  )
}

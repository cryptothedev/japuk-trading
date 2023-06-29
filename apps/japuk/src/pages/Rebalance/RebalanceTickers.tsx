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
import {
  FaBalanceScale,
  FaBalanceScaleLeft,
  FaBalanceScaleRight,
} from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

export const RebalanceTickers = () => {
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
        <Tr>
          <Td>BTCUSDT</Td>
          <Td>8,012.23</Td>
          <Td>
            <HStack spacing="4">
              <IconButton
                icon={<FaBalanceScaleRight fontSize="1.25rem" />}
                variant="solid"
                aria-label="Rebalance"
                colorScheme="red"
              />
              <IconButton
                icon={<MdDelete fontSize="1.25rem" />}
                variant="ghost"
                aria-label="Delete"
                colorScheme="black"
              />
            </HStack>
          </Td>
        </Tr>
        <Tr>
          <Td>ARBUSDT</Td>
          <Td>7,912.12</Td>
          <Td>
            <HStack spacing="4">
              <IconButton
                icon={<FaBalanceScaleLeft fontSize="1.25rem" />}
                variant="solid"
                aria-label="Rebalance"
                colorScheme="green"
              />
              <IconButton
                icon={<MdDelete fontSize="1.25rem" />}
                variant="ghost"
                aria-label="Delete"
                colorScheme="black"
              />
            </HStack>
          </Td>
        </Tr>
        <Tr>
          <Td>OPUSDT</Td>
          <Td>8,000</Td>
          <Td>
            <HStack spacing="4">
              <IconButton
                icon={<FaBalanceScale fontSize="1.25rem" />}
                variant="ghost"
                aria-label="Rebalance"
                isDisabled
              />
              <IconButton
                icon={<MdDelete fontSize="1.25rem" />}
                variant="ghost"
                aria-label="Delete"
                colorScheme="black"
              />
            </HStack>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
}

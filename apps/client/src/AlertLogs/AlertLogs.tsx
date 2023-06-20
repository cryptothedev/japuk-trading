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
import { FiArchive, FiPlay } from 'react-icons/fi'

import { useAlertLogWS } from './useAlertLogWS.ts'

interface AlertLog {
  time: string
  coin: string
  price: number
  reason: string
}

const alerts: AlertLog[] = [
  {
    time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    coin: 'BTCUSDT',
    price: 27002.12,
    reason: 'ชนแนวรับ กรอบสำคัญ',
  },
]

export const AlertLogs = () => {
  useAlertLogWS()

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Time</Th>
          <Th>Coin</Th>
          <Th>Price</Th>
          <Th>Reason</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {alerts.map(({ time, coin, price, reason }) => (
          <Tr key={time}>
            <td>{time}</td>
            <Td>{coin}</Td>
            <Td>{price}</Td>
            <Td>{reason}</Td>

            <Td>
              <HStack spacing="1">
                <IconButton
                  icon={<FiArchive fontSize="1.25rem" />}
                  variant="tertiary"
                  aria-label="Archive alert"
                />
                <IconButton
                  icon={<FiPlay fontSize="1.25rem" />}
                  variant="tertiary"
                  aria-label="Open order from alert"
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

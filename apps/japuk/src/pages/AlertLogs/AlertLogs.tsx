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

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { useAlertLog } from './useAlertLog'

export const AlertLogs = () => {
  const { alertLogs } = useAlertLog(false)

  return (
    <>
      <PageHeader
        title="Alert Logs"
        description="Logs triggered from Tradingview"
      />
      <Table variant="striped">
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
          {alertLogs.map(({ id, createdAt, coin, price, reason }) => {
            const date = new Date(createdAt)
            const dateTimeString = `${date.toLocaleDateString()}: ${date.toLocaleTimeString()}`

            return (
              <Tr key={id}>
                <Td>{dateTimeString}</Td>
                <Td>{coin}</Td>
                <Td>{price}</Td>
                <Td>{reason}</Td>

                <Td>
                  <HStack spacing="1">
                    <IconButton
                      icon={<FiArchive fontSize="1.25rem" />}
                      variant="tertiary"
                      aria-label="archive alert"
                    />
                    <IconButton
                      icon={<FiPlay fontSize="1.25rem" />}
                      variant="tertiary"
                      aria-label="open order from alert"
                    />
                  </HStack>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </>
  )
}

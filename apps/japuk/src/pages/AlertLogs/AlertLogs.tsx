import {
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { AlertLogResponse } from '@japuk/models'
import { useState } from 'react'
import { FiArchive, FiPlay } from 'react-icons/fi'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { TradingModal } from './TradingModal'
import { useAlertLog } from './useAlertLog'

export const AlertLogs = () => {
  const [selectedAlertLog, setSelectedAlertLog] = useState<AlertLogResponse>()

  const { alertLogs, dismissIt } = useAlertLog(true, true)

  const {
    isOpen: isTradingModalOpen,
    onOpen: onOpenTradingModal,
    onClose: onCloseTradingModal,
  } = useDisclosure()

  const openTradeModal = (alertLog: AlertLogResponse) => {
    onOpenTradingModal()
    setSelectedAlertLog(alertLog)
  }

  return (
    <>
      <PageHeader
        title="Alert Logs"
        description="Cut your losses short and let your profits run, and you may succeed."
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
          {alertLogs.map((alertLog) => {
            const { id, createdAt, coin, price, reason } = alertLog
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
                      aria-label="dismiss alert"
                      onClick={() => dismissIt(id)}
                      color="danger.500"
                    />
                    <IconButton
                      icon={<FiPlay fontSize="1.25rem" />}
                      variant="tertiary"
                      aria-label="open order from alert"
                      color="primary.500"
                      onClick={() => openTradeModal(alertLog)}
                    />
                  </HStack>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>

      {isTradingModalOpen && selectedAlertLog && (
        <TradingModal
          isOpen={isTradingModalOpen}
          onClose={onCloseTradingModal}
          alertLog={selectedAlertLog}
        />
      )}
    </>
  )
}

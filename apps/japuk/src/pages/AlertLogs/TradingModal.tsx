import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react'
import {
  AlertLogResponse,
  PositionSide,
  TradingCommandDto,
} from '@japuk/models'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SmartTradingService } from '../../services/smart-trading.service'
import { useSmartTrading } from './useSmartTrading'

type TradingFormValues = {
  amountUSD: string
  leverage: number
}

interface TradingModalProps {
  isOpen: boolean
  alertLog: AlertLogResponse
  onClose: () => void
}

export const TradingModal = ({
  isOpen,
  onClose,
  alertLog,
}: TradingModalProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TradingFormValues>({
    mode: 'all',
  })

  useEffect(() => {
    register('leverage', { required: 'Please input amount in USD to trade' })
  }, [register])

  const setLeverage = (leverage: number) => {
    setValue('leverage', leverage, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const getTradingCommand = (
    formValues: TradingFormValues,
    alertLog: AlertLogResponse,
    positionSide: PositionSide,
  ): TradingCommandDto => {
    const { amountUSD, leverage } = formValues
    const { coin } = alertLog
    return {
      symbol: coin,
      amountUSD: Number(amountUSD),
      leverage,
      side: positionSide,
    }
  }

  const handleLong = async (formValues: TradingFormValues) => {
    await futuresTrade(formValues, PositionSide.LONG)
  }

  const handleShort = async (formValues: TradingFormValues) => {
    await futuresTrade(formValues, PositionSide.SHORT)
  }

  const futuresTrade = async (
    formValues: TradingFormValues,
    side: PositionSide,
  ) => {
    setIsLoading(true)
    const tradingCommand = getTradingCommand(formValues, alertLog, side)
    await SmartTradingService.futuresTrade(tradingCommand)
    setIsLoading(false)
    onClose()
  }

  const { coin, price, reason } = alertLog

  const { tradingInfo } = useSmartTrading(coin)

  if (!tradingInfo) {
    return null
  }

  const { currentPrice, lowest, highest, leverages } = tradingInfo

  const toHighestPercent = ((highest - currentPrice) / currentPrice) * 100
  const toLowestPercent = ((currentPrice - lowest) / currentPrice) * 100
  const toHighestLeverage = Math.floor(100 / toHighestPercent)
  const toLowestLeverage = Math.floor(100 / toLowestPercent)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Smart Trading</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex justifyContent="space-between">
            <Text>
              <b>{coin}</b>
            </Text>
            <Text>
              Alert Price: <b>{price}</b>
            </Text>
          </Flex>
          <Flex mt={4}>
            <Text>
              Reason: <b>{reason}</b>
            </Text>
          </Flex>
          <Divider my={6} />
          <Stack spacing={6}>
            <Flex justifyContent="space-between">
              <Text fontSize="xl" color="danger.500">
                <b>Short</b>
              </Text>

              <Text fontSize="xl" color="primary.500">
                <b>Long</b>
              </Text>
            </Flex>

            <Flex justifyContent="space-between">
              <Text>
                Highest: <b>{highest}</b>
              </Text>
              <Text>
                Current: <b>{currentPrice}</b>
              </Text>
              <Text>
                Lowest: <b>{lowest}</b>
              </Text>
            </Flex>

            <Flex justifyContent="space-between">
              <Text>
                To highest (%): <b>{toHighestPercent.toLocaleString()}</b>
              </Text>

              <Text>
                To lowest (%): <b>{toLowestPercent.toLocaleString()}</b>
              </Text>
            </Flex>

            <Flex justifyContent="space-between">
              <Text>
                Leverage: <b>{toHighestLeverage}</b>
              </Text>

              <Text>
                Leverage: <b>{toLowestLeverage}</b>
              </Text>
            </Flex>
          </Stack>

          <Divider my={6} />
          <form onSubmit={handleSubmit(handleShort)}>
            <FormControl isInvalid={Boolean(errors.amountUSD)} mb={6}>
              <FormLabel htmlFor="rebalanceTo">Amount (USD)</FormLabel>
              <Input
                id="rebalanceTo"
                placeholder="100"
                {...register('amountUSD', {
                  required: 'Please input amount in USD to trade',
                })}
              />
              {errors.amountUSD && errors.amountUSD.message && (
                <FormErrorMessage>{errors.amountUSD.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={Boolean(errors.leverage)} mb={6}>
              <FormLabel htmlFor="rebalanceTo">Leverage</FormLabel>
              <HStack spacing={3}>
                {leverages.map((leverage) => {
                  return (
                    <Button
                      key={leverage}
                      variant="outline"
                      onClick={() => setLeverage(leverage)}
                      isActive={getValues('leverage') === leverage}
                    >
                      {leverage}
                    </Button>
                  )
                })}
              </HStack>
              {errors.leverage && errors.leverage.message && (
                <FormErrorMessage>{errors.leverage.message}</FormErrorMessage>
              )}
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="danger"
            mr={3}
            onClick={handleSubmit(handleShort)}
            isDisabled={isLoading}
          >
            Short
          </Button>
          <Button
            colorScheme="primary"
            mr={3}
            onClick={handleSubmit(handleLong)}
            isDisabled={isLoading}
          >
            Long
          </Button>
          <Button
            onClick={onClose}
            colorScheme="neutral"
            isDisabled={isLoading}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

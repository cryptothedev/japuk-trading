import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { UpsertTickersDto } from '@japuk/models'
import { useForm } from 'react-hook-form'

interface AddTickerModalProps {
  upsertTicker: (upsertTickersDto: UpsertTickersDto) => void
  isLoading: boolean
  isOpen: boolean
  onClose: () => void
}

type AddTickerFormValues = {
  pair: string
}
export const AddTickerModal = ({
  upsertTicker,
  isLoading,
  isOpen,
  onClose,
}: AddTickerModalProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AddTickerFormValues>({
    mode: 'all',
  })

  const handleSave = (formValues: AddTickerFormValues) => {
    const { pair } = formValues
    upsertTicker({ pairs: pair.toUpperCase().split(',') })
    reset()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new ticker</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(handleSave)}>
            <FormControl isInvalid={Boolean(errors.pair)}>
              <FormLabel htmlFor="rebalanceTo">Name</FormLabel>
              <Input
                id="rebalanceTo"
                placeholder="BTCUSDT"
                {...register('pair', {
                  required: 'Please input ticker name',
                })}
              />
              {errors.pair && errors.pair.message && (
                <FormErrorMessage>{errors.pair.message}</FormErrorMessage>
              )}
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="primary"
            mr={3}
            isDisabled={isLoading}
            onClick={handleSubmit(handleSave)}
          >
            Add
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

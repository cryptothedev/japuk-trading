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
import { UpsertTickerDto } from '@japuk/models'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface AddTickerModalProps {
  upsertTicker: (upsertTickerDto: UpsertTickerDto) => void
  upsertTickerLoadingStatus: QueryStatus
  isOpen: boolean
  onClose: () => void
}

type AddTickerFormValues = {
  name: string
}
export const AddTickerModal = ({
  upsertTicker,
  upsertTickerLoadingStatus,
  isOpen,
  onClose,
}: AddTickerModalProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddTickerFormValues>({
    mode: 'all',
  })

  const handleSave = (formValues: AddTickerFormValues) => {
    const { name } = formValues
    upsertTicker({ name })
    setIsLoading(true)
  }

  useEffect(() => {
    if (isLoading && upsertTickerLoadingStatus === QueryStatus.fulfilled) {
      onClose()
    }
  }, [upsertTickerLoadingStatus, onClose, isLoading])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add new ticker</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(handleSave)}>
            <FormControl isInvalid={Boolean(errors.name)}>
              <FormLabel htmlFor="rebalanceTo">Name</FormLabel>
              <Input
                id="rebalanceTo"
                placeholder="BTCUSDT"
                {...register('name', {
                  required: 'Please input ticker name',
                })}
              />
              {errors.name && errors.name.message && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
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

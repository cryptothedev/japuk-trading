import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { PageHeader } from '../../components/PageHeader/PageHeader'

type SettingsFormValues = {
  rebalanceTo: string
}

export const Settings = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<SettingsFormValues>({
    defaultValues: { rebalanceTo: '8000' },
    mode: 'onChange',
  })

  function onSubmit(formValues: SettingsFormValues) {
    console.log(formValues)
  }

  const canSave = isValid && isDirty

  return (
    <>
      <Flex justifyContent="space-between">
        <PageHeader title="Settings" description="Up to your preferences" />

        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
          onClick={handleSubmit(onSubmit)}
          isDisabled={!canSave}
        >
          Save
        </Button>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.rebalanceTo)} maxW="sm">
          <FormLabel htmlFor="rebalanceTo">Rebalance To (USD)</FormLabel>
          <Input
            id="rebalanceTo"
            placeholder="0"
            {...register('rebalanceTo', {
              required: 'Please put amount in USD',
            })}
          />
          {errors.rebalanceTo && errors.rebalanceTo.message && (
            <FormErrorMessage>{errors.rebalanceTo.message}</FormErrorMessage>
          )}
        </FormControl>
      </form>
    </>
  )
}

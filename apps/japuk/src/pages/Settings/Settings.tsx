import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { useSetting } from './useSetting'

type SettingsFormValues = {
  rebalanceTo: string
}

export const Settings = () => {
  const { setting, upsert, settingLoadingStatus, upsertSettingLoadingStatus } =
    useSetting(false)

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<SettingsFormValues>({
    mode: 'onChange',
  })

  const onSubmit = async (formValues: SettingsFormValues) => {
    await upsert({ rebalanceToUSD: Number(formValues.rebalanceTo) })
  }

  useEffect(() => {
    setValue('rebalanceTo', setting.rebalanceToUSD.toString())
  }, [setValue, setting])

  const canSave = isValid && isDirty
  const isLoading =
    settingLoadingStatus === QueryStatus.pending ||
    upsertSettingLoadingStatus === QueryStatus.pending

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
          isDisabled={!canSave || isLoading}
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

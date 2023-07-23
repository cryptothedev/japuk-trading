import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { useSetting } from './useSetting'

type SettingsFormValues = {
  rebalanceTo: string
  futuresAmount: string
  maxLeverage: string
  username: string
  avatarUrl: string
}

export const Settings = () => {
  const {
    setting,
    upsertIt,
    settingLoadingStatus,
    upsertSettingLoadingStatus,
  } = useSetting(false)

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<SettingsFormValues>({
    mode: 'onChange',
  })

  const onSubmit = async (formValues: SettingsFormValues) => {
    const { rebalanceTo, futuresAmount, maxLeverage, username, avatarUrl } =
      formValues
    await upsertIt({
      rebalanceToUSD: Number(rebalanceTo),
      futuresAmountUSD: Number(futuresAmount),
      maxLeverage: Number(maxLeverage),
      username,
      avatarUrl,
    })
  }

  useEffect(() => {
    const {
      rebalanceToUSD,
      futuresAmountUSD,
      maxLeverage,
      username,
      avatarUrl,
    } = setting
    setValue('rebalanceTo', rebalanceToUSD.toString())
    setValue('futuresAmount', futuresAmountUSD.toString())
    setValue('maxLeverage', maxLeverage.toString())
    setValue('username', username.toString())
    setValue('avatarUrl', avatarUrl.toString())
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
        <Stack spacing={8}>
          <FormControl isInvalid={Boolean(errors.username)} maxW="sm">
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              placeholder="cryptodev"
              {...register('username', {
                required: 'Please input your username',
              })}
            />
            {errors.username && errors.username.message && (
              <FormErrorMessage>{errors.username.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={Boolean(errors.avatarUrl)} maxW="sm">
            <FormLabel htmlFor="avatarUrl">Avatar (URL)</FormLabel>
            <Input
              id="avatarUrl"
              placeholder="http://picture.com/avatar.url"
              {...register('avatarUrl', {
                required: 'Please input your avatar url',
              })}
            />
            {errors.avatarUrl && errors.avatarUrl.message && (
              <FormErrorMessage>{errors.avatarUrl.message}</FormErrorMessage>
            )}
          </FormControl>

          <Divider />

          <FormControl isInvalid={Boolean(errors.rebalanceTo)} maxW="sm">
            <FormLabel htmlFor="rebalanceTo">Rebalance To (USD)</FormLabel>
            <Input
              id="rebalanceTo"
              placeholder="0"
              {...register('rebalanceTo', {
                required: 'Please input amount in USD',
              })}
            />
            {errors.rebalanceTo && errors.rebalanceTo.message && (
              <FormErrorMessage>{errors.rebalanceTo.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={Boolean(errors.futuresAmount)} maxW="sm">
            <FormLabel htmlFor="futuresAmount">Futures Amount (USD)</FormLabel>
            <Input
              id="futuresAmount"
              placeholder="0"
              {...register('futuresAmount', {
                required: 'Please input amount in USD',
              })}
            />
            {errors.futuresAmount && errors.futuresAmount.message && (
              <FormErrorMessage>
                {errors.futuresAmount.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={Boolean(errors.maxLeverage)} maxW="sm">
            <FormLabel htmlFor="maxLeverage">Max Leverage</FormLabel>
            <Input
              id="maxLeverage"
              placeholder="0"
              {...register('maxLeverage', {
                required: 'Please input max leverage',
              })}
            />
            {errors.maxLeverage && errors.maxLeverage.message && (
              <FormErrorMessage>{errors.maxLeverage.message}</FormErrorMessage>
            )}
          </FormControl>
        </Stack>
      </form>
    </>
  )
}

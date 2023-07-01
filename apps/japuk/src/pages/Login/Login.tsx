import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'

import { PageHeader } from '../../components/PageHeader/PageHeader'
import { AuthSelector } from '../../store/auth/authSelector'
import { fetchApiToken } from '../../store/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/store'

type LoginFormValues = {
  password: string
}

export const Login = () => {
  const apiTokenLoadingStatus = useAppSelector(
    AuthSelector.apiTokenLoadingStatus,
  )
  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: 'onChange',
  })

  const onSubmit = async ({ password }: LoginFormValues) => {
    dispatch(fetchApiToken(password))
  }

  const isLoading = apiTokenLoadingStatus === QueryStatus.pending

  if (apiTokenLoadingStatus === QueryStatus.fulfilled) {
    return <Navigate to="/" />
  }

  return (
    <>
      <PageHeader
        title="Japuk Trading"
        description="Please login to use the app"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={Boolean(errors.password)} maxW="sm">
          <FormLabel htmlFor="password">App password</FormLabel>
          <Input
            id="password"
            {...register('password', {
              required: 'Please input app password',
            })}
          />
          {errors.password && errors.password.message && (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
        </FormControl>
      </form>

      <Button
        mt={4}
        colorScheme="teal"
        isLoading={isLoading}
        type="submit"
        onClick={handleSubmit(onSubmit)}
      >
        Login
      </Button>
    </>
  )
}

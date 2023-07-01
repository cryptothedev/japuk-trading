import { Box, Flex } from '@chakra-ui/react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { LeftNav } from './components/LeftNav/LeftNav'
import { routes } from './configs/routes'
import { AuthSelector } from './store/auth/authSelector'
import { useAppSelector } from './store/store'

export const App = () => {
  const { pathname } = useLocation()

  const apiToken = useAppSelector(AuthSelector.apiToken)

  if (!apiToken && pathname !== routes.login.path) {
    return <Navigate to="/login" />
  }

  return (
    <Box height="100vh" overflow="hidden" position="relative">
      <Flex h="full" id="app-container">
        <LeftNav />
        <Box flex="1" p="12" overflow="auto">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  )
}

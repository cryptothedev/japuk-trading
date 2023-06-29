import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

import { LeftNav } from './components/LeftNav/LeftNav'
import { useSetting } from './pages/Settings/useSetting'
import { useTicker } from './pages/Rebalance/useTicker'
import { useAlertLog } from './pages/AlertLogs/useAlertLog'

export const App = () => {
  useAlertLog(true)
  useSetting(true)
  useTicker(true)

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

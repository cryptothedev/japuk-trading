import { Box, Flex, useColorModeValue as mode } from '@chakra-ui/react'

import { AlertLogs } from './AlertLogs/AlertLogs'
import { LeftNav } from './LeftNav/LeftNav'

export const App = () => {
  return (
    <Box height="100vh" overflow="hidden" position="relative">
      <Flex h="full" id="app-container">
        <LeftNav />
        <Box flex="1" p="6">
          <AlertLogs />
        </Box>
      </Flex>
    </Box>
  )
}

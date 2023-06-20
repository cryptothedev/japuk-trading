import {
  Container,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  Tabs,
} from '@chakra-ui/react'

import { AlertLogs } from './AlertLogs/AlertLogs.tsx'

export const App = () => {
  return (
    <Container py={{ base: '12', md: '16' }}>
      <Stack spacing="8">
        <Tabs size="md" variant="indicator">
          <TabList>
            <Tab>Alert Logs</Tab>
          </TabList>
          <TabIndicator />
        </Tabs>

        <AlertLogs />
      </Stack>
    </Container>
  )
}

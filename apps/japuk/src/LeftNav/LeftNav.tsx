import { Box, Flex, Stack } from '@chakra-ui/react'
import {
  BiCreditCard,
  BiEnvelope,
  BiNews,
  BiPurchaseTagAlt,
} from 'react-icons/bi'

import { AccountSwitcher } from './AccountSwitcher'
import { NavGroup } from './NavGroup'
import { NavItem } from './NavItem'

export const LeftNav = () => {
  return (
    <Box w="64" bg="gray.900" color="white" fontSize="sm">
      <Flex h="full" direction="column" px="4" py="4">
        <AccountSwitcher />
        <Stack spacing="8" flex="1" overflow="auto" pt="8">
          <NavGroup label="Tools">
            <NavItem icon={<BiCreditCard />} label="Rebalance" />
            <NavItem icon={<BiPurchaseTagAlt />} label="Alert Logs" />
          </NavGroup>

          <NavGroup label="Today Insights">
            <NavItem icon={<BiEnvelope />} label="My Portfolios" />
            <NavItem icon={<BiNews />} label="High Volumes" />
          </NavGroup>
        </Stack>
      </Flex>
    </Box>
  )
}

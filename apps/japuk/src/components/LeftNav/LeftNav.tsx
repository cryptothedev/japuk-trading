import { Box, Flex, Stack } from '@chakra-ui/react'
import {
  BiCreditCard,
  BiEnvelope,
  BiNews,
  BiPurchaseTagAlt,
} from 'react-icons/bi'
import { useLocation } from 'react-router-dom'

import { AccountSwitcher } from './AccountSwitcher'
import { NavGroup } from './NavGroup'
import { NavItem } from './NavItem'

const navGroups = [
  {
    groupLabel: 'Tools',
    items: [
      { label: 'Rebalance', to: '/rebalance', icon: <BiCreditCard /> },
      { label: 'Alert Logs', to: '/alert-logs', icon: <BiPurchaseTagAlt /> },
    ],
  },
  {
    groupLabel: 'Today Insights',
    items: [
      { label: 'My Portfolios', to: '/my-portfolios', icon: <BiEnvelope /> },

      { label: 'High Volumes', to: '/high-volumes', icon: <BiNews /> },
    ],
  },
]

export const LeftNav = () => {
  const { pathname } = useLocation()

  const isMatch = (to: string) => {
    return pathname === to
  }

  return (
    <Box w="64" bg="gray.900" color="white" fontSize="sm">
      <Flex h="full" direction="column" px="4" py="4">
        <AccountSwitcher />
        <Stack spacing="8" flex="1" overflow="auto" pt="8">
          {navGroups.map((navGroup) => {
            const { groupLabel, items } = navGroup
            return (
              <NavGroup key={groupLabel} label={groupLabel}>
                {items.map((item) => {
                  const { to, icon, label } = item
                  return (
                    <NavItem
                      key={to}
                      to={to}
                      icon={icon}
                      label={label}
                      active={isMatch(to)}
                    />
                  )
                })}
              </NavGroup>
            )
          })}
        </Stack>
      </Flex>
    </Box>
  )
}

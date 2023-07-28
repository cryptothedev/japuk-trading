import { Box, Flex, Stack } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'

import { routes } from '../../configs/routes'
import { AccountSwitcher } from './AccountSwitcher'
import { NavGroup } from './NavGroup'
import { NavItem } from './NavItem'

const navGroups = [
  {
    groupLabel: 'Tools',
    items: [
      {
        label: routes.rebalance.label,
        to: routes.rebalance.path,
        icon: routes.rebalance.icon,
      },
      {
        label: routes.alertLogs.label,
        to: routes.alertLogs.path,
        icon: routes.alertLogs.icon,
      },
      {
        label: routes.highVolume.label,
        to: routes.highVolume.path,
        icon: routes.highVolume.icon,
      },
    ],
  },
  {
    groupLabel: 'Others',
    items: [
      {
        label: routes.settings.label,
        to: routes.settings.path,
        icon: routes.settings.icon,
      },
    ],
  },
]

export const LeftNav = () => {
  const { pathname } = useLocation()

  const isMatch = (to: string) => {
    return pathname.includes(to)
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

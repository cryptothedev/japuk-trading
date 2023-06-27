import { Box, Flex, HStack, IconButton, Text } from '@chakra-ui/react'
import { FaBalanceScaleLeft } from 'react-icons/fa'
import { FiRefreshCw } from 'react-icons/fi'
import { Outlet, useLocation } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader/PageHeader'

const TabItems = [
  {
    title: 'Tickers',
    to: '/rebalance',
  },
]

export const Rebalance = () => {
  return (
    <>
      <Flex justifyContent="space-between">
        <PageHeader
          title="Rebalance"
          description="Tools to take make it easy for rebalancing"
        />

        <Box>
          <Text>
            <b>3</b> pairs
          </Text>
          <Text>
            Each to <b>$8,000</b>
          </Text>
          <Text>
            Total <b>$23,924.35</b>
          </Text>
          <Text color="red.500">
            <b>(-$75.65)</b>
          </Text>
        </Box>

        <HStack spacing={2} alignSelf="flex-end">
          <IconButton
            icon={<FaBalanceScaleLeft fontSize="1.25rem" />}
            variant="solid"
            aria-label="Rebalance"
            colorScheme="green"
          />
          <IconButton
            icon={<FiRefreshCw fontSize="1.25rem" />}
            variant="ghost"
            aria-label="Rebalance"
          />
        </HStack>
      </Flex>

      <Outlet />
    </>
  )
}

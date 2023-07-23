import {
  Box,
  Flex,
  FlexProps,
  HStack,
  Img,
  useMenuButton,
} from '@chakra-ui/react'
import { HiDotsVertical } from 'react-icons/hi'
import { useSelector } from 'react-redux'

import { SettingSelector } from '../../store/setting/settingSelector'

export const AccountSwitcherButton = (props: FlexProps) => {
  const { username, avatarUrl } = useSelector(SettingSelector.setting)
  const buttonProps = useMenuButton(props)
  return (
    <Flex
      as="button"
      {...buttonProps}
      w="full"
      display="flex"
      alignItems="center"
      rounded="lg"
      bg="gray.700"
      px="3"
      py="2"
      fontSize="sm"
      userSelect="none"
      cursor="pointer"
      outline="0"
      transition="all 0.2s"
      _active={{ bg: 'gray.600' }}
      _focus={{ shadow: 'outline' }}
    >
      <HStack flex="1" spacing="3">
        <Img
          w="8"
          h="8"
          rounded="md"
          objectFit="cover"
          src={avatarUrl}
          alt="CryptoDev"
        />
        <Box textAlign="start">
          <Box noOfLines={1} fontWeight="semibold">
            {username}
          </Box>
          <Box fontSize="xs" color="gray.400">
            Japuk Trading
          </Box>
        </Box>
      </HStack>
      <Box fontSize="lg" color="gray.400">
        <HiDotsVertical />
      </Box>
    </Flex>
  )
}

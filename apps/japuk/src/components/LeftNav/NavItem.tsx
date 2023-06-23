import { Box, HStack } from '@chakra-ui/react'
import { ReactElement, ReactNode } from 'react'
import { BsCaretRightFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'

interface NavItemProps {
  to: string
  label: string
  subtle?: boolean
  active?: boolean
  icon: ReactElement
  endElement?: ReactElement
  children?: ReactNode
}

export const NavItem = (props: NavItemProps) => {
  const { active, subtle, icon, children, label, endElement, to } = props
  return (
    <HStack
      as={Link}
      to={to}
      w="full"
      px="3"
      py="2"
      cursor="pointer"
      userSelect="none"
      rounded="md"
      transition="all 0.2s"
      bg={active ? 'gray.700' : undefined}
      _hover={{ bg: 'gray.700' }}
      _active={{ bg: 'gray.600' }}
    >
      <Box fontSize="lg" color={active ? 'currentcolor' : 'gray.400'}>
        {icon}
      </Box>
      <Box
        flex="1"
        fontWeight="inherit"
        color={subtle ? 'gray.400' : undefined}
      >
        {label}
      </Box>
      {endElement && !children && <Box>{endElement}</Box>}
      {children && <Box fontSize="xs" flexShrink={0} as={BsCaretRightFill} />}
    </HStack>
  )
}

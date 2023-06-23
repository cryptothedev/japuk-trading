import { Box, Heading, Stack, Text } from '@chakra-ui/react'

interface PageHeaderProps {
  title: string
  description: string
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <Box as="section" bg="bg.surface" pb="12">
      <Stack spacing="1">
        <Heading size={{ base: 'xs', md: 'sm' }} fontWeight="medium">
          {title}
        </Heading>
        <Text color="fg.muted">{description}</Text>
      </Stack>
    </Box>
  )
}

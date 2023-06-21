import { theme as proTheme } from '@chakra-ui/pro-theme'
import { theme as baseTheme, extendTheme } from '@chakra-ui/react';


export const theme = extendTheme(
  {
    colors: { ...baseTheme.colors, brand: baseTheme.colors.blue },
  },
  proTheme,
)
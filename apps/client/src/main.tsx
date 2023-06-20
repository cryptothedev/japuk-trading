import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'

import { App } from './App.tsx'
import { theme } from './configs/theme.ts'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
)

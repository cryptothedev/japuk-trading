import { createBrowserRouter } from 'react-router-dom'

import { AlertLogs } from '../AlertLogs/AlertLogs'
import { App } from '../App'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/rebalance', element: <h1>Rebalance</h1> },
      { path: '/alert-logs', element: <AlertLogs /> },
      { path: '/my-portfolios', element: <h1>My Portfolios</h1> },
      { path: '/high-volumes', element: <h1>High Volumes</h1> },
    ],
  },
])

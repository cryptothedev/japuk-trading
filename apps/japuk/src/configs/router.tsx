import { createBrowserRouter } from 'react-router-dom'

import { AlertLogs } from '../AlertLogs/AlertLogs'
import { App } from '../App'
import { Rebalance } from '../Rebalance/Rebalance'
import { RebalanceTickers } from '../Rebalance/RebalanceTickers'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/rebalance',
        element: <Rebalance />,
        children: [
          {
            index: true,
            element: <RebalanceTickers />,
          },
        ],
      },
      { path: '/alert-logs', element: <AlertLogs /> },
      { path: '/my-portfolios', element: <h1>My Portfolios</h1> },
      { path: '/high-volumes', element: <h1>High Volumes</h1> },
    ],
  },
])

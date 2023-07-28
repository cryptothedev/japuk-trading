import { Navigate, createBrowserRouter } from 'react-router-dom'

import { App } from '../App'
import { routes } from './routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: routes.login.path,
        element: routes.login.element,
      },
      {
        path: routes.rebalance.path,
        element: routes.rebalance.element,
      },
      { path: routes.alertLogs.path, element: routes.alertLogs.element },
      { path: routes.highVolume.path, element: routes.highVolume.element },
      { path: routes.settings.path, element: routes.settings.element },
      { path: '/', element: <Navigate to={routes.rebalance.path} /> },
      { path: '*', element: <Navigate to={routes.rebalance.path} /> },
    ],
  },
])

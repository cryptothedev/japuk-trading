import { FaBalanceScale, FaList } from 'react-icons/fa'
import { FiSettings } from 'react-icons/fi'

import { AlertLogs } from '../pages/AlertLogs/AlertLogs'
import { Rebalance } from '../pages/Rebalance/Rebalance'
import { Settings } from '../pages/Settings/Settings'

export const routes = {
  rebalance: {
    label: 'Rebalance',
    path: '/rebalance',
    element: <Rebalance />,
    icon: <FaBalanceScale />,
  },
  alertLogs: {
    label: 'Alert Logs',
    path: '/alert-logs',
    element: <AlertLogs />,
    icon: <FaList />,
  },
  settings: {
    label: 'Settings',
    path: '/settings',
    element: <Settings />,
    icon: <FiSettings />,
  },
}

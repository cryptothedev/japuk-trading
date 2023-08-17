import { BsFillBarChartFill } from 'react-icons/bs'
import { FaBalanceScale, FaList } from 'react-icons/fa'
import { FiSettings } from 'react-icons/fi'
import { SiFuturelearn } from 'react-icons/si'

import { AlertLogs } from '../pages/AlertLogs/AlertLogs'
import { FuturesTrade } from '../pages/FuturesTrade/FuturesTrade'
import { HighVolume } from '../pages/HighVolume/HighVolume'
import { Login } from '../pages/Login/Login'
import { Rebalance } from '../pages/Rebalance/Rebalance'
import { Settings } from '../pages/Settings/Settings'

export const routes = {
  login: {
    label: 'Login',
    path: '/login',
    element: <Login />,
  },
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
  futuresTrade: {
    label: 'Futures Trade',
    path: '/futures-trade',
    element: <FuturesTrade />,
    icon: <SiFuturelearn />,
  },
  highVolume: {
    label: 'High Volume',
    path: '/high-volume',
    element: <HighVolume />,
    icon: <BsFillBarChartFill />,
  },
  settings: {
    label: 'Settings',
    path: '/settings',
    element: <Settings />,
    icon: <FiSettings />,
  },
}

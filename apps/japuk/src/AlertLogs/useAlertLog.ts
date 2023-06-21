import { AlertLogEvent, AlertLogResponse } from '@japuk/models'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

import { AlertLogSelector } from '../store/alert-log/alertLogSelector'
import { addAlertLog, fetchAlertLogs } from '../store/alert-log/alertLogSlice'
import { useAppDispatch, useAppSelector } from '../store/store'

export const useAlertLog = () => {
  const dispatch = useAppDispatch()
  const alertLogs = useAppSelector(AlertLogSelector.alertLogs)
  const alertLogsLoadingStatus = useAppSelector(
    AlertLogSelector.alertLogsLoadingStatus,
  )

  useEffect(() => {
    const socket = io('http://localhost:3000/alert-log')

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('disconnect', () => {
      console.log(socket.id)
    })

    socket.on(AlertLogEvent.New, (newAlertLog: AlertLogResponse) => {
      dispatch(addAlertLog(newAlertLog))
    })

    dispatch(fetchAlertLogs())

    return () => {
      console.log('disconnect')
      socket.disconnect()
    }
  }, [dispatch])

  return {
    alertLogs,
    alertLogsLoadingStatus,
  }
}

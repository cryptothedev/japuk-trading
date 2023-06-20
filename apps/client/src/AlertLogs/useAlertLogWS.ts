import { useEffect } from 'react'
import { io } from 'socket.io-client'

export const useAlertLogWS = () => {
  useEffect(() => {
    const socket = io('http://localhost:3000/alert-log')

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('disconnect', () => {
      console.log(socket.id)
    })

    socket.on('new', console.log)

    return () => {
      console.log('disconnect')
      socket.disconnect()
    }
  }, [])
}

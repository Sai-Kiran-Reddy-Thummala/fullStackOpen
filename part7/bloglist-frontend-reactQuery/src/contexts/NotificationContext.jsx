import { createContext, useContext, useReducer } from 'react'

const NotificationReducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.payload
  case 'ADD':
    return action.payload
  case 'DELETE':
    return action.payload
  case 'LIKE':
    return action.payload
  case 'ERROR':
    return action.payload
  case 'RESET':
    return null
  default:
    return state
  }
}

export const NotificationContext = createContext()

const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    NotificationReducer,
    null
  )

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const [notification, ] = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const [, notificationDispatch] = useContext(NotificationContext)
  return notificationDispatch
}

export default NotificationContextProvider

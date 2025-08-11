import PropTypes from "prop-types";
import { createContext, useContext, useReducer } from "react"

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            return `You have added the anecdote '${action.payload}'`
        case 'VOTE':
            return `Anecdote '${action.payload}' voted`
        case 'RESET':
            return ''
        case 'ERROR':
            return action.payload
        default:
            return state
    }
}

export const NotificationContext = createContext()

const NotificationContextProvider = ({ children }) => {
    const [notification, dispatch] = useReducer(notificationReducer, '')

    return (
        <NotificationContext.Provider value={[notification, dispatch]}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContextProvider

NotificationContextProvider.propTypes = {
    children: PropTypes.node
}
import { useContext } from "react"
import { NotificationContext } from "./NotificationContext"

export const useNotificationValue = () => {
    const [notification] = useContext(NotificationContext)
    return notification
}
export const useNotificationDispatch = () => {
    const [, dispatch] = useContext(NotificationContext)
    return dispatch
}
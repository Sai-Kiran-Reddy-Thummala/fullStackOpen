import { useNotification } from '../contexts/NotificationContext'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useNotification()

  const notificationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 15,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  }

  return notification && <Alert variant="success">{notification}</Alert>
}

export default Notification

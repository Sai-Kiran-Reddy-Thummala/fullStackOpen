import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        anecdoteNotification(state, action) {
            return action.payload
        },
        clearNotification() {
            return ''
        }
    }
})

export const { anecdoteNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const setNotification = (notification, timeout) => {
    return async dispatch => {
        dispatch(anecdoteNotification(notification))

        if (timeoutId) {
            clearTimeout(timeoutId) // clears the previous time out
        }

        timeoutId = setTimeout(() => {
            dispatch(clearNotification())
        }, timeout);
    }
}
export default notificationSlice.reducer
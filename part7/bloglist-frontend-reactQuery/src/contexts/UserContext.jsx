import { useReducer, createContext, useContext } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.payload
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const UserContext = createContext()

const UserContextProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[ user, userDispatch ]}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const [user,] = useContext(UserContext)
  return user
}

export const useUserDispatch = () => {
  const [, userDispatch] = useContext(UserContext)
  return userDispatch
}

export default UserContextProvider

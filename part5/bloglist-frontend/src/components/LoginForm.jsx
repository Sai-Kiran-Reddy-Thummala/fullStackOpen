import PropTypes from 'prop-types'
import { useState } from 'react'

const LoginForm = ({
  userLogin
}) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    await userLogin({ username, password })
    setUsername('')
    setPassword('')
  }
  return (
    <form onSubmit={handleLogin}>
      <div>
        <h2>Login to application</h2>
        username <input
          data-testid='username'
          value={username}
          name='username'
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password <input
          data-testid='password'
          value={password}
          name='password'
          onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type='submit'>Log-in</button>
    </form>
  )
}

LoginForm.displayName = 'LoginForm'

LoginForm.propTypes = {
  userLogin: PropTypes.func.isRequired
}
export default LoginForm
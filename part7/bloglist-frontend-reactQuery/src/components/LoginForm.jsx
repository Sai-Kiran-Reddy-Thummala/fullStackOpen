import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ userLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    await userLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
            data-testid="username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
            data-testid="password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  )
}

LoginForm.displayName = 'LoginForm'

LoginForm.propTypes = {
  userLogin: PropTypes.func.isRequired,
}

export default LoginForm

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useRef, useEffect } from 'react'
import { Link, Routes, Route, useMatch, Navigate } from 'react-router-dom'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Users from './components/Users'
import User from './components/User'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import About from './components/About'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import { useNotificationDispatch } from './contexts/NotificationContext'
import { useUserDispatch, useUserValue } from './contexts/UserContext'
import { Navbar, Nav, Button, Container } from 'react-bootstrap'

const App = () => {
  const user = useUserValue()
  const notificationDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const queryClient = useQueryClient()
  const blogRef = useRef()
  const timeoutRef = useRef(null)

  const padding = { paddingRight: 15 }

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  })

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const loggedUser = JSON.parse(loggedUserJson)
      userDispatch({ type: 'LOGIN', payload: loggedUser })
      blogService.setToken(loggedUser.token)
    }
  }, [userDispatch])

  const showNotification = (type, payload, timeout = 3000) => {
    notificationDispatch({ type, payload })
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(
      () => notificationDispatch({ type: 'RESET' }),
      timeout
    )
  }

  const userMutationQuery = useMutation({
    mutationFn: loginService.login,
    onSuccess: (loggedUser) => {
      window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
      userDispatch({ type: 'LOGIN', payload: loggedUser })
      blogService.setToken(loggedUser.token)
    },
    onError: () => {
      showNotification('ERROR', 'Wrong credentials')
    },
  })

  const createQuery = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      showNotification(
        'ADD',
        `new blog ${newBlog.title}, by ${newBlog.author} added`
      )
    },
    onError: (error) => {
      showNotification('ERROR', error.message)
    },
  })

  const likeMutationQuery = useMutation({
    mutationFn: blogService.updateLikes,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      )
      showNotification(
        'LIKE',
        `You have liked the blog '${updatedBlog.title}'`
      )
    },
    onError: (error) => {
      showNotification('ERROR', error.body)
    },
  })

  const deleteMutationQuery = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      showNotification('DELETE', 'The blog is deleted')
    },
    onError: (error) => {
      showNotification('ERROR', error.response.data.error)
    },
  })

  const handleLogin = (credentials) => userMutationQuery.mutate(credentials)
  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    userDispatch({ type: 'LOGOUT' })
  }
  const handleCreate = (blog) => {
    blogRef.current.handleVisibility()
    createQuery.mutate(blog)
  }
  const toggleLikes = (id) => {
    const blogToUpdate = blogs.find((blog) => blog.id === id)
    if (!blogToUpdate) {
      showNotification('LIKE', `blog with id ${id} does not exist`)
      return
    }
    likeMutationQuery.mutate({
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id,
    })
  }
  const handleDelete = (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id)
    if (!blogToDelete) {
      showNotification('DELETE', 'The blog is already removed from the server')
      return
    }
    if (window.confirm(`Remove blog '${blogToDelete.title}'?`)) {
      deleteMutationQuery.mutate(id)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="Create" ref={blogRef}>
      <BlogForm handleCreate={handleCreate} />
    </Togglable>
  )

  if (usersQuery.isLoading) return <div>Loading.....</div>
  if (usersQuery.isError)
    return <div>Unable to fetch users data due to server issue</div>
  if (blogsQuery.isLoading) return <div>Loading...</div>
  if (blogsQuery.isError)
    return (
      <div>Error: Blog service is not available due to problems at server</div>
    )

  const users = usersQuery.data
    ? [...usersQuery.data].sort((a, b) => b.blogs.length - a.blogs.length)
    : []
  const selectedUser = userMatch
    ? users.find((u) => u.id.toString() === userMatch.params.id)
    : null
  const blogs = blogsQuery.data
    ? [...blogsQuery.data].sort((a, b) => b.likes - a.likes)
    : []
  const selectedBlog = blogMatch
    ? blogs.find((b) => b.id.toString() === blogMatch.params.id)
    : null

  return (
    <div className="container">
      <h1>Blog App</h1>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        style={{ marginBottom: '1rem' }}
      >
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as="span">
                <Link style={padding} to="/">
                  Blogs
                </Link>
              </Nav.Link>
              <Nav.Link as="span">
                <Link style={padding} to="/users">
                  Users
                </Link>
              </Nav.Link>
              <Nav.Link as="span">
                <Link style={padding} to="/about">
                  About
                </Link>
              </Nav.Link>

              {user ? (
                <>
                  <Nav.Link as="span">
                    <em style={padding}>{user.name} logged in</em>
                  </Nav.Link>
                  <Nav.Link as="span">
                    <Button
                      data-testid="logout"
                      onClick={handleLogout}
                      variant="outline-light"
                      size="sm"
                    >
                      Logout
                    </Button>
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as="span">
                  <Link style={padding} to="/login">
                    Login
                  </Link>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <>
              {!user && (
                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  <LoginForm userLogin={handleLogin} />
                </div>
              )}
              {user && (
                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  {blogForm()}
                </div>
              )}
              <Blogs blogs={blogs} />
            </>
          }
        />
        <Route
          path="/users"
          element={user ? <Users users={users} /> : <Navigate replace to="/" />}
        />
        <Route
          path="/users/:id"
          element={
            user ? <User user={selectedUser} /> : <Navigate replace to="/" />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            selectedBlog ? (
              <Blog
                blog={selectedBlog}
                toggleLikes={user ? () => toggleLikes(selectedBlog.id) : null}
                handleDelete={user ? () => handleDelete(selectedBlog.id) : null}
              />
            ) : (
              <Navigate replace to="/" />
            )
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}

export default App

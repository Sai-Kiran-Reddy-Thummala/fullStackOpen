import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleCreate = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)
      blogRef.current.handleVisibility() // handleVisibility of Togglable is exposed by using useRef -> forwardRef -> useImperativeHandle
      setBlogs(blogs.concat(newBlog))
      setMessage(`new blog ${newBlog.title}, by ${newBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      console.log(error.message)
      setMessage(error.message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const toggleLikes = async (id) => {
    try {
      let blogToUpdate = blogs.find(blog => blog.id === id)
      if (!blogToUpdate) {
        setMessage(`blog with id ${id} does not exist`)
        setTimeout(() => setMessage(null), 5000)
        return
      }

      blogToUpdate = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
        user: blogToUpdate.user.id
      }
      const updatedBlog = await blogService.updateLikes(id, blogToUpdate)
      setBlogs(blogs.map(blog =>
        blog.id === id
          ? { ...blog, likes: updatedBlog.likes }
          : blog
      ))
    } catch (error) {
      console.log(error)
      setMessage('Something went wrong while liking the blog.')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    if (!blogToDelete) {
      setMessage('The blog is already removed from the server')
      setTimeout(() => setMessage(null), 5000)
      return
    }

    const confirmDelete = window.confirm(`Remove blog '${blogToDelete.title}'?`)
    if (!confirmDelete) return

    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setMessage(`The blog '${blogToDelete.id}' is deleted`)
      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      setMessage(error.response.data.error)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel='Login'>
      <LoginForm
        userLogin={handleLogin} />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel='Create' ref={blogRef}>
      <BlogForm
        createBlog={handleCreate} />
    </Togglable>
  )

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <Notification message={message} />
      <h2>Blogs</h2>

      {user === null ? (
        <>
          {loginForm()}
        </>
      ) : (
        <>
          <p>
            <span>{user.name} logged-in </span>
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
        </>
      )}

      {sortedBlogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          toggleLikes={() => toggleLikes(blog.id)}
          handleDelete={() => handleDelete(blog.id)}
          username={user?.username} />
      ))}
    </div>
  )
}

export default App
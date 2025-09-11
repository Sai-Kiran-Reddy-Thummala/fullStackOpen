import axios from 'axios'
const baseUrl = '/api/blogs'

let token = ''

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const authConfig = () => {
  return {
    headers: { Authorization: token },
  }
}
// Blogs
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog, authConfig())
  return response.data
}

const updateLikes = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, authConfig())
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, authConfig())
  return response.data
}

// Comments made on blogs

const getAllComments = async () => {
  const response = await axios.get(`${baseUrl}/comments`)
  return response.data
}

const getComment = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/comments`)
  return response.data
}

const postComment = async ({ id, text }) => {
  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    {text},
    authConfig()
  )
  return response.data
}

export default {
  getAll,
  create,
  setToken,
  updateLikes,
  remove,
  getAllComments,
  getComment,
  postComment,
}

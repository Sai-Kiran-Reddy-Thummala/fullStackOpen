const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialBlogs = [
    {
      title:"React patterns",
      author:"Michael Chan",
      url:"https://reactpatterns.com/",
      likes:7
    },
    {
      title:"Go To Statement Considered Harmful",
      author:"Edsger W. Dijkstra",
      url:"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes:5
    }
  ]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const passwordHash = await bcrypt.hash('root3', 10)
  const user = new User({
          username: 'root3',
          name: 'root3',
          passwordHash
        })

 const savedUser = await user.save()

 const token = jwt.sign({username: savedUser.username, id: savedUser._id}, process.env.SECRET)

  const tempBlog = new Blog({
    title: "The Road to React",
    author: "Robin Wieruch",
    user: savedUser._id,
    url: "https://www.roadtoreact.com/",
    likes: 30
  })

await tempBlog.save()
await tempBlog.deleteOne()

return { 
  nonExistingId : tempBlog._id.toString(), 
  token, 
  userId: savedUser._id
}
}

module.exports = {
    initialBlogs, blogsInDb, nonExistingId
}
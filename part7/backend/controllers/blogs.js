const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");
const middleware = require("../utils/middleware");

//////////////////////////////////////
// COMMENTS ROUTES FIRST TO AVOID CONFLICTS

// Get all comments
blogsRouter.get("/comments", async (request, response) => {
  const comments = await Comment.find({});
  response.json(comments);
});

// Get comments for a specific blog
blogsRouter.get("/:id/comments", async (request, response) => {
  const blogId = request.params.id;
  if (!blogId)
    return response.status(400).json({ error: "Blog ID is required" });

  const comments = await Comment.find({ blog: blogId });
  response.json(comments);
});

// Add a comment to a blog
blogsRouter.post(
  "/:id/comments",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const blogId = request.params.id;
    const { text } = request.body;

    if (!blogId || !text) {
      return response
        .status(400)
        .json({ error: "Blog ID and comment text are required" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return response.status(404).json({ error: "Blog not found" });

    const comment = new Comment({ blog: blogId, comment: { text } });
    const savedComment = await comment.save();

    blog.comments = blog.comments.concat(savedComment._id);
    await blog.save();

    response.status(201).json(savedComment);
  }
);

//////////////////////////////////////
// BLOG CRUD ROUTES

// Get all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, })
    .populate("comments", { comment: 1, });

  response.status(200).json(blogs);
});

// Create a blog
blogsRouter.post(
  "/",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { title, url, author, likes } = request.body;
    const user = request.user;

    if (!title || !url) {
      return response.status(400).json({ error: "Title or URL missing" });
    }

    const blog = new Blog({
      title,
      url,
      author,
      likes: likes || 0,
      user: user._id,
    });

    let savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    savedBlog = await savedBlog.populate("user", {
      username: 1,
      name: 1,
      id: 1,
    });
    response.status(201).json(savedBlog);
  }
);

// Get blog by ID (after comment routes to avoid conflicts)
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(404).json({ error: "Blog not found" });
  response.json(blog);
});

// Update a blog
blogsRouter.put(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const { title, author, url, likes, user } = request.body;
    const updatedBlogData = { title, author, url, likes, user };

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      updatedBlogData,
      { new: true }
    );
    if (!updatedBlog)
      return response.status(404).json({ error: "Blog not found" });

    response.status(200).json(updatedBlog);
  }
);

// Delete a blog
blogsRouter.delete(
  "/:id",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) return response.status(204).end();

    if (blog.user.toString() === request.user.id.toString()) {
      await blog.deleteOne();
      return response.status(204).end();
    }

    return response
      .status(401)
      .json({ error: "Only creator can delete this blog" });
  }
);

module.exports = blogsRouter;

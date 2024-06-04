const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
 
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  let blog

  if(body.likes){
    blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

  }else{
    blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: 0,
      user: user._id
    })
  }
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
 
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id).populate('user')

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  const blogUserID = blog.user._id.toString()

  console.log(blogUserID)

  if(decodedToken.id === blogUserID){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }else{
    return response.status(401).json({ error: 'unauthorized to delete' })
  }
  
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})


module.exports = blogsRouter
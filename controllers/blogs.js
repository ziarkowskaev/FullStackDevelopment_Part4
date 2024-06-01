const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  const body = request.body
  let blog

  if(body.likes){
    blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    })

  }else{
    blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: 0,
    })
  }

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

})

module.exports = blogsRouter
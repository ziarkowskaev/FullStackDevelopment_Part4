const { test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('there are two blogs', async () => {
const response = await api.get('/api/blogs')

assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
   const response =  await api.get('/api/blogs')
             
   const ids = response.body.map(e => e.id)
   assert(ids.length > 0)
})

test('a blog can be added ', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
      }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  })


  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      } 
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')

    //check the number of likes of the last submitted blog
    const likes = response.body[response.body.length-1].likes
  
    assert.strictEqual(likes,0)
  })

  test(' if the title or url is missing, response with code 400 Bad Request', async () => {
    const newBlogNoAuthor = {
        title: "TDD harms architecture",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
    }

    await api
    .post('/api/blogs')
    .send(newBlogNoAuthor)
    .expect(400)

    const newBlogNoURL = {
    title: "First class tests",
    author: "Robert C. Martin",
    likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlogNoURL)
      .expect(400)
  

      const newBlogNoAuthorNoURL = {
        title: "JavaScript basics",
        likes: 35,
        }
    
    await api
      .post('/api/blogs')
      .send(newBlogNoAuthorNoURL)
      .expect(400)

    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })


after(async () => {
  await mongoose.connection.close()
})
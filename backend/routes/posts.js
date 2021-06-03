const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
    res.send(posts)
  } catch (error) {
    res.send({ message: error })
  }
})

// Get specific post
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    res.send(post)
  } catch (error) {
    res.send({ message: error })
  }
})

// Create post
router.post('/', async (req, res) => {
  const post = new Post({
    url: req.body.url,
    user: req.body.user,
    location: req.body.location,
    tags: req.body.tags
  })

  try {
    res.send(post.save())
  } catch (error) {
    res.send({ message: error })
  }
})

// Update post
router.patch('/:postId', async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.params.postId },
      { $set: {
          user: req.body.user,
          location: req.body.location,
          tags: req.body.tags
        } 
      }
    )
    res.send(updatedPost)
  } catch (error) {
    res.send({ message: error })
  }
})

// Delete post
router.delete('/:postId', async (req, res) => {
  try {
    const deletePost = await Post.deleteOne(
      { _id: req.params.postId }
    )
    res.send(deletePost)
  } catch (error) {
    res.send({ message: error })
  }
})

module.exports = router

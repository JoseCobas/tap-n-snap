const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Get all users
router.get('/', async (req, res) => {
    try {
      const users = await User.find()
      res.send(users)
    } catch (error) {
      res.send({ message: error })
    }
})

// Get specific user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    res.send(user)
  } catch (error) {
    res.send({ message: error })
  }
})

// Update user
router.put('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.userId },
      { $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        } 
      }
    )
    res.send(updatedUser)
  } catch (error) {
    res.send({ message: error })
  }
})

module.exports = router
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())
app.use(express.json({ limit: '100mb'}))
app.use(cors( {
  credentials: true,
  origin: 'http://localhost:3000'
}))

// Authentication route
const AuthRoute = require('./backend/routes/auth')
app.use('/', AuthRoute)

// Post route
const postRouter = require('./backend/routes/posts')
app.use('/posts', postRouter)

// Handle SSE
require('./backend/sse-handler')(app)

const userRouter = require('./backend/routes/users')
app.use('/users', userRouter)

// Connect to DB
mongoose.connect(
  'mongodb+srv://admin:pa55w0rd@cluster0.cmulc.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => { console.log('DB connected') }
)

app.listen(4000, () => console.log('server started on port 4000'))

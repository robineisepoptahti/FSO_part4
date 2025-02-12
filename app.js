const notesRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const express = require('express')
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')

MONGODB_URI = config.MONGODB_URI

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.errorHandler)


module.exports = app

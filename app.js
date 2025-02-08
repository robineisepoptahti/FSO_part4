const notesRouter = require('./controllers/blogs')
const express = require('express')
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors')
const mongoose = require('mongoose')

MONGODB_URI = config.MONGODB_URI

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', notesRouter)



module.exports = app

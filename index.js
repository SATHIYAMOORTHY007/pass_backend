require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const cookieParser = require('cookie-parser')
const PORT = process.env.port || 3500
var cors = require('cors')
const authRouter = require('./Routers/auth')
const homeRouter = require('./Routers/home')

var nodemailer = require('nodemailer')

app.use(cors())

connectDB()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())

app.use('/auth', authRouter)
app.use('/auth', homeRouter)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('./config/db')();
require('dotenv').config()
const userRoute = require('./routes/user')

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(cors())

// Routes
app.use('/', userRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})
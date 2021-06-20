const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = 8081

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const routes = require('./routes/routes.js')(app, fs, port)
const server = app.listen(port, () => {
  console.log(`Skypattern api is listening at http://localhost:${port}`)
})

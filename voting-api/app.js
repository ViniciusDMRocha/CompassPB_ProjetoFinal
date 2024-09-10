const express = require('express')
const routes = require('./routes')
const corsMiddleware = require('./cors')

const app = express()
const stage = process.env.STAGE || 'dev'

app.disable('x-powered-by')
app.use(express.json())
app.use(corsMiddleware)
app.use(`/${stage}/app`, routes)

module.exports = app


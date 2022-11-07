const sqlite3 = require('sqlite3').verbose()
const { Router } = require('express')
const express = require('express')
const router = require('./router')

const app = express()
const port = 3000
const db = new sqlite3.Database('./db/pizza-analytics.db')

app.use(express.json())
router(app, db)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

app.on('close', () => {
  db.close()
})

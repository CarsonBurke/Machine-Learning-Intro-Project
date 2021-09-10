require('dotenv').config()
const express = require('express')
const session = require('express-session')
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const { Pool, Client } = require('pg')

let app = express()

let client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
})

try {

    client.connect()
    console.log("connected to db")
} catch {

    console.log("failed to connect to db")
}

app.use(session({
    name: "userSession",
    secret: 'secretCode',
    saveUninitialized: true,
    resave: false,
    duration: 2592000000,
    activeDuration: 2592000000,
    secure: true
}))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/views'))

app.get('/', async function(req, res) {

    res.render(__dirname + "/views/index.ejs")
})

app.get('/game', async function(req, res) {

    res.render(__dirname + "/views/game.ejs")
})

app.listen(5200)

console.log("Listening on http://localhost:" + 5200)
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser") //used to parse incoming request bodies in a middleware
const config = require("./config")
const port = config.PORT || 5000
const db = config.MONGODB_URI
const app = express()
require("dotenv").config()

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(bodyParser.json())
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err))

app.listen(port, (req, res) => {
  console.log(`Server up and running on port ${port}`)
})

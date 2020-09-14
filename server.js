const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser") //used to parse incoming request bodies in a middleware
const config = require("./config")
const user = require("./routes/users")
const post = require("./routes/posts")
const reply = require("./routes/replies")
const port = config.PORT || 5000
const db = config.MONGODB_URI
const app = express()

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(bodyParser.json())
app.use(cors())
app.use("/api/users", user)
app.use("/api/posts", post)
app.use("/api/replies", reply)
//Database Connection
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err))

app.listen(port, (req, res) => {
  console.log(`Server up and running on port ${port}`)
})

const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserSchema = new Schema({
  //All Users
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Join_Date: {
    type: Date,
    default: Date.now,
  },
  Updated_At: {
    type: Date,
    default: Date.now,
  },
  Deleted: {
    type: Boolean,
    default: false,
  },
  Username: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
})
module.exports = User = mongoose.model("users", UserSchema)

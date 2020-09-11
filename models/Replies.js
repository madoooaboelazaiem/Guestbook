const mongoose = require("mongoose")
const Schema = mongoose.Schema
var ObjectId = mongoose.Schema.Types.ObjectId
const UserSchema = new Schema({
  From: {
    type: ObjectId,
    required: true,
    ref: "users",
  },
  To: {
    type: ObjectId,
    required: true,
    ref: "users",
  },
  Message: {
    type: String,
    required: true,
  },
  Created_At: {
    type: Date,
    default: Date.now,
  },
  Deleted: {
    type: Boolean,
    default: false,
  },
})
module.exports = Replies = mongoose.model("replies", UserSchema)

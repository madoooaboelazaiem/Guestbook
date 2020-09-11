const mongoose = require("mongoose")
const Schema = mongoose.Schema
var ObjectId = mongoose.Schema.Types.ObjectId
const UserSchema = new Schema({
  user_id: {
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
module.exports = Posts = mongoose.model("posts", UserSchema)

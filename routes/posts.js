const express = require("express")
const router = express.Router()

const post = require("../controllers/posts")

const middleware = require("../middleware/auth")

router.post("/:user_id", middleware.verifyToken, post.CreatePost) //I should be able to add post
router.delete("/:user_id/:post_id", middleware.verifyToken, post.DeletePost)
router.get("", middleware.verifyToken, post.GetAllPosts)
router.put("/:user_id/:post_id", middleware.verifyToken, post.UpdatePost)

module.exports = router

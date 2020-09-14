const express = require("express")
const router = express.Router()

//const group = require('../controllers/groups');
const reply = require("../controllers/replies")

const middleware = require("../middleware/auth")

router.post("/:post_id", middleware.verifyToken, reply.CreateReply)
router.delete("/:user_id/:reply_id", middleware.verifyToken, reply.DeleteReply)
router.put("/:user_id/:reply_id", middleware.verifyToken, reply.EditReply)
router.get(
  "/:user_id/:post_id",
  middleware.verifyToken,
  reply.GetAllRepliesToPost
)

module.exports = router

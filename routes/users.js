const express = require("express")
const router = express.Router()

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user = require("../controllers/users")
const middleware = require("../middleware/auth")
// User Registration, SignUp and SignIn
router.post("/login", user.Login)
router.put("/deactivate/:user_id", middleware.verifyToken, user.deleteProfile)
router.put("/activate/:user_id", middleware.verifyToken, user.activateAccount)
router.put("/resetPassword/:token", user.ResetPassword)
router.put("/requestResetPassword", user.RequestResetPassword)
router.post("/registration", user.UserRegistration)
router.put("/updateProfile/:user_id", middleware.verifyToken, user.UpdateUser)
router.get("/getUserInfo/:user_id", middleware.verifyToken, user.getUserInfo)
module.exports = router

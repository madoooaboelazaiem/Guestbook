const tokenKey = require("../config").SECRETKEY
const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"]
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ")
    // Get token from array
    const bearerToken = bearer[1]
    // Set the tokenc
    if (bearer[0] !== "Bearer") {
      return res
        .status(400)
        .send({ status: "failure", message: "Authentication Failed" })
    } else {
      req.token = bearerToken
      // Next middleware
      jwt.verify(req.token, tokenKey, async (err, authData) => {
        if (err) {
          return res
            .status(400)
            .send({ status: "failure", message: "Authentication Failed" })
        } else {
          req.user_id = authData.id
          req.email = authData.email
          next()
        }
      })
    }
  } else {
    // Forbidden
    return res.status(403).send({ status: "failure", message: "Unauthorized" })
  }
}
function generateAccessToken(payload) {
  // expires after half and hour (1800 seconds = 30 minutes)
  const token = jwt.sign(payload, tokenKey, { expiresIn: "6h" })
  return `Bearer ${token}`
}
module.exports = {
  verifyToken,
  generateAccessToken,
}

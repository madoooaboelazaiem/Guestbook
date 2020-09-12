const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
// const passport = require('passport')
const User = require("../models/User")
const middleware = require("../middleware/auth")
const EmailAdapter = require("../helpers/mailAdapter")
const path = require("path")
const crypto = require("crypto")

require("dotenv").config()
Login = async function (req, res) {
  try {
    const validation =
      req.body && req.body.Email != null && req.body.Password != null
    if (!validation) {
      return res
        .status(400)
        .send({ status: "failure", message: "Params Missing" })
    }
    const { Email, Password } = req.body
    const user = await User.findOne({ Email: Email })
    if (!user) {
      return res
        .status(404)
        .send({ status: "failure", message: "Email Not Found" })
    }
    const match = bcrypt.compareSync(Password, user.Password)
    if (match) {
      if (user.Deleted === true) {
        return res.status(403).send({
          status: "failure",
          message:
            "Account is currently deactivated request to activate your account through email",
        })
      } else {
        const payload = {
          id: user._id,
        }
        req.user_id = user._id
        req.role = user.User_Category
        const token = middleware.generateAccessToken(payload)
        return res.status(200).send({
          status: "success",
          token: token,
        })
      }
    } else return res.status(400).send({ error: "Wrong password" })
  } catch (e) {
    console.log(e)
    res.status(422).send({ status: "failure", message: "Sign In Failed" })
  }
}

UserRegistration = async function (req, res) {
  try {
    const validation =
      req.body && req.body.Password != null && req.body.Email != null
    if (!validation) {
      return res
        .status(400)
        .send({ status: "failure", message: "Params are missing" })
    } else {
      const email = req.body.Email
      const user = await User.findOne({ Email: req.body.Email })
      if (user) {
        return res
          .status(400)
          .send({ status: "failure", message: "Email Already Exists" })
      }
      try {
        const sendMail = await EmailAdapter.send(
          "guestbook@mado.com",
          email,
          "Welcome To Our Guestbook Demo",
          "Congratulations, You are now a registered user, Enjoy!!",
          ""
        )
        const encrypted = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.Password, encrypted)
        req.body.Password = hashedPassword
        req.body.Deleted = false
        const newUser = await User.create(req.body)
        const userCreated = await User.findOne({ _id: newUser._id })
        res.status(200).send({
          status: "success",
          msg: "User created successfully",
          data: userCreated,
        })
      } catch (e) {
        console.log(e)
        res
          .status(422)
          .send({ status: "failure", message: "User Creation Failed" })
      }
    }
  } catch (error) {
    console.log(error)
    res.status(422).send({ status: "failure", message: "User Creation Failed" })
  }
}
UpdateUser = async function (req, res) {
  try {
    const validation = req.body
    if (!validation) {
      return res
        .status(400)
        .send({ status: "failure", message: "Params are missing" })
    } else {
      if (req.user_id !== req.params.user_id) {
        return res
          .status(404)
          .send({ status: "failure", message: "Access Forbidden" })
      }
      const user = await User.findOne({ _id: req.params.user_id })
      if (!user) {
        return res
          .status(404)
          .send({ status: "failure", message: "User Not Found" })
      }
      if (user.Deleted === true) {
        // Deactivated send message to activate
        return res.status(404).send({
          status: "failure",
          message:
            "Account is deactivated to activate your account please request access",
        })
      } else {
        dataToBeUpdated = {
          First_Name: req.body.First_Name,
          Last_Name: req.body.Last_Name,
        }

        const newUser = await User.updateOne(
          { _id: req.params.user_id },
          dataToBeUpdated
        )
        const userCreated = await User.findOne({ _id: req.params.user_id })
        res.status(200).send({
          status: "success",
          msg: "User Updated successfully",
          data: userCreated,
        })
      }
    }
  } catch (error) {
    console.log(error)
    res
      .status(422)
      .send({ status: "failure", message: "Update Profile Failed" })
  }
}

deleteProfile = async function (req, res) {
  try {
    const validation = req.body
    if (!validation) {
      return res
        .status(400)
        .send({ status: "failure", message: "Params are missing" })
    } else {
      if (req.user_id !== req.params.user_id) {
        return res
          .status(404)
          .send({ status: "failure", message: "Access Forbidden" })
      }
      const user = await User.findOne({ _id: req.params.user_id })
      if (!user) {
        return res
          .status(404)
          .send({ status: "failure", message: "User Not Found" })
      }
      if (user.Deleted === true) {
        return res
          .status(401)
          .send({ status: "failure", message: "Account Already Deactivated" })
      } else {
        const deleteUser = await User.updateOne(
          { _id: req.params.user_id },
          { Deleted: true }
        )
        return res
          .status(200)
          .send({ status: "success", msg: "Account Deactivated successfully" })
      }
    }
  } catch (error) {
    console.log(error)
    res
      .status(422)
      .send({ status: "failure", message: "Update Profile Failed" })
  }
}
activateAccount = async function (req, res) {
  try {
    const validation = req.body
    if (!validation) {
      return res
        .status(400)
        .send({ status: "failure", message: "Params are missing" })
    } else {
      if (req.user_id !== req.params.user_id) {
        return res
          .status(404)
          .send({ status: "failure", message: "Access Forbidden" })
      }
      const user = await User.findOne({ _id: req.params.user_id })
      if (!user) {
        return res
          .status(404)
          .send({ status: "failure", message: "User Not Found" })
      }
      if (user.Deleted === false) {
        return res
          .status(401)
          .send({ status: "failure", message: "Account Already Activated" })
      } else {
        const deleteUser = await User.updateOne(
          { _id: req.params.user_id },
          { Deleted: false }
        )
        return res
          .status(200)
          .send({ status: "success", msg: "Account Activated Successfully" })
      }
    }
  } catch (error) {
    console.log(error)
    res
      .status(422)
      .send({ status: "failure", message: "Update Profile Failed" })
  }
}
RequestResetPassword = async function (req, res) {
  try {
    const validation = req.body && req.body.Email != null
    if (!validation) {
      return res
        .status(400)
        .send({ status: "failure", message: "Params are missing" })
    } else {
      const email = req.body.Email
      const user = await User.findOne({ Email: req.body.Email })

      if (!user) {
        return res
          .status(400)
          .send({ status: "failure", message: "Email Already Exists" })
      }
      try {
        const token = await crypto.randomBytes(20).toString("hex")
        const sendMail = await EmailAdapter.send(
          "eza+@eza.com",
          email,
          "Oh No",
          "Please reset your password by clicking the following link " +
            `https://eza-plus.herokuapp.com/reset/${token}`,
          ""
        )
        const newUser = await User.updateOne(
          { Email: req.body.Email },
          { token: token }
        )
        return res.status(200).send({
          status: "success",
          msg: "An Email Has Been Sent To Reset Your Password",
        })
      } catch (e) {
        console.log(e)
        res
          .status(422)
          .send({ status: "failure", message: "Changing Password Failed" })
      }
    }
  } catch (error) {
    console.log(error)
    res
      .status(422)
      .send({ status: "failure", message: "Changing Password Failed" })
  }
}
getUserInfo = async function (req, res) {
  try {
    if (req.user_id !== req.params.user_id) {
      return res
        .status(404)
        .send({ status: "failure", message: "Access Forbidden" })
    }
    const user = await User.findOne({ _id: req.params.user_id })
    if (!user) {
      return res
        .status(404)
        .send({ status: "failure", message: "User Not Found" })
    }
    if (user.Deleted === true) {
      return res
        .status(401)
        .send({ status: "failure", message: "Account Activated" })
    } else {
      const returnedUser = await User.findOne({
        _id: req.params.user_id,
        Deleted: false,
      })
      return res.status(200).send({ status: "success", data: returnedUser })
    }
  } catch (error) {
    console.log(error)
    res.status(422).send({ status: "failure", message: "Get the Info Failed" })
  }
}

ResetPassword = async function (req, res) {
  try {
    const validation = req.body && req.params.token != null
    if (!validation) {
      return res
        .status(400)
        .send({ status: "failure", message: "Params are missing" })
    } else {
      const user = await User.findOne({ token: req.params.token })
      if (!user) {
        return res.status(400).send({
          status: "failure",
          message: "Forbidden Access Token Expired",
        })
      }
      const token = req.params.token
      const confirmPassword = req.body.confirmPassword
      const password = req.body.Password
      if (password !== confirmPassword) {
        return res
          .status(404)
          .send({ status: "failuer", msg: "Password Does Not Match" })
      }
      const encrypted = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(req.body.Password, encrypted)
      req.body.Password = hashedPassword
      var dataToBeUpdated = {
        Password: req.body.Password,
      }
      const newUser = await User.updateOne({ token: token }, dataToBeUpdated)
      const removeToken = await User.updateOne(
        { token: token },
        { token: "None" }
      )
      res
        .status(200)
        .send({ status: "success", msg: "Password Changed Successfully" })
    }
  } catch (error) {
    console.log(error)
    res
      .status(422)
      .send({ status: "failure", message: "Changing Password Failed" })
  }
}
module.exports = {
  UserRegistration,
  Login,
  UpdateUser,
  deleteProfile,
  activateAccount,
  RequestResetPassword,
  getUserInfo,
  ResetPassword,
}

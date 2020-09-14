// const passport = require('passport')
const Post = require("../models/Post")
const User = require("../models/User")
const Reply = require("../models/Reply")
const EmailAdapter = require("../helpers/mailAdapter")
const PublicFunctions = require("../helpers/publicFunctions")
CreateReply = async function (req, res) {
  try {
    const validation = req.body && req.body.Message != null
    if (!validation) {
      return res
        .status(400)
        .send({ status: "failure", message: "Params are missing" })
    }
    const user = await User.findOne({ _id: req.user_id })
    if (!user) {
      return res
        .status(404)
        .send({ status: "failure", message: "User Not Found" })
    }
    const post = await Post.findById(req.params.post_id)
    if (!post) {
      return res
        .status(404)
        .send({ status: "failure", message: "Post Not Found" })
    }
    var allReplies = await Reply.find({
      post_id: req.params.post_id,
      user_id: { $ne: req.user_id },
      Deleted: false,
    }).populate({ path: "user_id", select: "Email" })
    if (user.Deleted === true) {
      // Deactivated send message to activate
      return res.status(404).send({
        status: "failure",
        message:
          "Account is deactivated to activate your account please request access",
      })
    } else {
      //ToBe Checked
      const { Message } = req.body
      const getUserEmail = await User.findOne({ _id: post.user_id })
      if (!getUserEmail) {
        return res.status(404).send({
          status: "failure",
          message: "The User Posted this post may have removed it",
        })
      }
      try {
        // const sendMail = await EmailAdapter.send(
        //   "guestbook@mado.com",
        //   getUserEmail.Email,
        //   "Activty Digest",
        //   "Someone Replied On A Post You're Included In, Please Sign In To See The Reply!" +
        //     `https://signinpage.com`,
        //   ""
        // )
        if (allReplies) {
          allReplies = PublicFunctions.getUnique(allReplies, "user_id")
          //   console.log(allReplies)
        }
        // allReplies.map(async (reply) => {
        //   const forwardMail = await EmailAdapter.send(
        //     "guestbook@mado.com",
        //     reply.user_id.Email,
        //     "Activty Digest",
        //     "Someone Replied On A Post You're Included In, Please Sign In To See The Reply!" +
        //       `https://signinpage.com`,
        //     ""
        //   )
        // })
        const replyObject = {
          Message: Message,
          user_id: req.user_id,
          post_id: req.params.post_id,
        }
        const createReply = await Reply.create(replyObject)
        const replyCreated = await Reply.findOne({ _id: createReply._id })
        if (replyCreated) {
          res.status(200).send({
            status: "success",
            msg: "Reply Created successfully",
            data: replyCreated,
          })
        } else {
          return res.status(404).send({
            status: "failure",
            message: "error occured while creating the reply",
          })
        }
      } catch (e) {
        console.log(e)
        res
          .status(422)
          .send({ status: "failure", message: "Reply Submission Failed" })
      }
    }
  } catch (error) {
    console.log(error)
    res
      .status(422)
      .send({ status: "failure", message: "Reply Submission Failed" })
  }
}

DeleteReply = async function (req, res) {
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
    const reply = await Reply.findOne({ _id: req.params.reply_id })
    if (!reply) {
      return res
        .status(404)
        .send({ status: "failure", message: "Reply Not Found" })
    }
    if (reply.user_id.toString() === req.params.user_id) {
      if (user.Deleted === true) {
        return res.status(404).send({
          status: "failure",
          message:
            "Account is deactivated to activate your account please request access",
        })
      } else {
        await Reply.findOneAndUpdate(
          { user_id: req.params.user_id, _id: req.params.reply_id },
          { Deleted: true }
        )
        const deletedReply = await Reply.find({
          user_id: req.params.user_id,
          _id: req.params.reply_id,
        })
        res.status(200).send({
          status: "success",
          msg: "Reply Deleted successfully",
          data: deletedReply,
        })
      }
    } else {
      res
        .status(403)
        .send({ status: "failure", message: "Unauthorized Action" })
    }
  } catch (error) {
    console.log(error)
    res
      .status(422)
      .send({ status: "failure", message: "Reply Deletion Failed" })
  }
}
EditReply = async function (req, res) {
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
    const reply = await Reply.findOne({ _id: req.params.reply_id })
    if (!reply) {
      return res
        .status(404)
        .send({ status: "failure", message: "Reply Not Found" })
    }
    if (reply.user_id.toString() === req.params.user_id) {
      if (user.Deleted === true) {
        return res.status(404).send({
          status: "failure",
          message:
            "Account is deactivated to activate your account please request access",
        })
      } else {
        await Reply.findOneAndUpdate(
          { user_id: req.params.user_id, _id: req.params.reply_id },
          { Message: req.body.Message }
        )
        const deletedReply = await Reply.find({
          user_id: req.params.user_id,
          _id: req.params.reply_id,
        })
        res.status(200).send({
          status: "success",
          msg: "Reply Updated successfully",
          data: deletedReply,
        })
      }
    } else {
      res
        .status(403)
        .send({ status: "failure", message: "Unauthorized Action" })
    }
  } catch (error) {
    console.log(error)
    res.status(422).send({ status: "failure", message: "Reply Update Failed" })
  }
}

GetAllRepliesToPost = async function (req, res) {
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
    const post = await Post.findOne({ _id: req.params.post_id })
    if (!post) {
      return res
        .status(404)
        .send({ status: "failure", message: "Post Not Found" })
    }

    if (user.Deleted === true) {
      return res.status(404).send({
        status: "failure",
        message:
          "Account is deactivated to activate your account please request access",
      })
    } else {
      const allReplies = await Reply.find({
        post_id: req.params.post_id,
        Deleted: false,
      })
        .populate({ path: "user_id" })
        .populate({ path: "post_id" })
      res.status(200).send({
        status: "success",
        msg: "Replies Fetched successfully",
        data: allReplies,
      })
    }
  } catch (error) {
    console.log(error)
    res
      .status(422)
      .send({ status: "failure", message: "Replies Fetching Failed" })
  }
}

module.exports = {
  CreateReply,
  DeleteReply,
  GetAllRepliesToPost,
  EditReply,
}

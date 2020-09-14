// Comment.js
import React, { Component } from "react"
import moment from "moment"
import PropTypes from "prop-types"
import ReactMarkdown from "react-markdown"
import AuthService from "../services/authServices"
import axios from "axios"
import "font-awesome/css/font-awesome.css"

const API_URL = "http://localhost:3000/api/posts/"
class Comment extends Component {
  constructor(props) {
    super(props)
    this.updatePost = this.updatePost.bind(this)
  }
  updatePost(id) {
    const enteredName = prompt("Enter the new message")
    var user = AuthService.getCurrentUser()
    // e.preventDefault()
    // console.log(this.state)
    if (!enteredName) return
    axios
      .put(API_URL + `${user.id}/${id}`, {
        Message: enteredName,
      })
      .then((res) => {
        alert("Message Updated Successfully")
      })
      .catch((e) => {
        alert("There was a problem updating the message please try again later")
      })
  }
  render() {
    return (
      <div className="singleComment">
        <img
          alt="user_image"
          className="userImage"
          src={`https://picsum.photos/70?random=${this.props.id}`}
        />
        <div className="textContent">
          <div className="singleCommentContent">
            <h3>{this.props.author}</h3>
            <ReactMarkdown source={this.props.children} />
          </div>
          <div className="singleCommentButtons">
            <span className="time">
              {moment(this.props.timestamp).fromNow()}
            </span>
            <button
              // onClick={() => {
              //   this.props.handleUpdateComment(this.props.id)
              // }}
              onClick={() => {
                this.updatePost(this.props.id)
              }}
            >
              <i className="fa fa-wrench"></i>
              {/* <i className="fa fa-comment" /> */}
            </button>
            <button
              onClick={() => {
                this.props.handleDeleteComment(this.props.id)
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
}

export default Comment
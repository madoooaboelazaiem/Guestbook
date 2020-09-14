// ReplyForm.js
import React, { Component } from "react"
import AuthService from "../services/authServices"
import axios from "axios"
const API_URL = "https://backendguestbook.herokuapp.com/api/replies/"
class ReplyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Message: "",
      author: "",
      done: false,
      error: true,
    }
    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  onChange(e) {
    // console.log(this.state.Message)
    this.setState({ [e.target.name]: e.target.value })
  }
  handleSubmit(e) {
    const replyId = this.props.replyId
    var user = AuthService.getCurrentUser()
    console.log(replyId, "in reply form")
    // e.preventDefault()
    // console.log(this.state)
    if (!this.state.Message) return
    const posting = axios
      .post(API_URL + `${replyId}`, {
        Message: this.state.Message,
      })
      .then((res) => {
        this.setState({ done: true, author: user.Email })
        alert("Reply Message Sent")
      })
      .catch((e) => {
        this.setState({ error: false })
        alert(
          "There was a problem replying please try again later redirecting to post page"
        )
      })
    if (this.state.done) {
      this.props.history.push("/post")
    } else {
      this.props.history.push("/post")
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="Message"
          placeholder="Enter your Reply..."
          onChange={this.onChange}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default ReplyForm

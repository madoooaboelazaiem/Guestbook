// CommentForm.js
import React, { Component } from "react"
import PropTypes from "prop-types"
import AuthService from "../services/authServices"
import axios from "axios"
const API_URL = "http://localhost:3000/api/posts/"
class CommentForm extends Component {
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
    var user = AuthService.getCurrentUser()
    // e.preventDefault()
    // console.log(this.state)
    if (!this.state.Message) return
    const posting = axios
      .post(API_URL + user.id, {
        Message: this.state.Message,
      })
      .then((res) => {
        this.setState({ done: true, author: user.Email })
      })
      .catch((e) => {
        alert("There was a problem posting a message please try again later")
      })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="Message"
          placeholder="Enter your Message..."
          onChange={this.onChange}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default CommentForm

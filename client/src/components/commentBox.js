// CommentBox.js
import React, { Component } from "react"
import "whatwg-fetch"
import CommentList from "./commentList"
import CommentForm from "./commentForm"
import AuthService from "../services/authServices"
import axios from "axios"
import "./commentBox.css"
const API_URL = "https://backendguestbook.herokuapp.com/api/posts/"
class CommentBox extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      error: null,
      author: "",
      Message: "",
      done: false,
      result: null,
    }
    this.pollInterval = null
    // this.onChangeMessage = this.onChangeMessage.bind(this)
    // this.submitPost = this.submitPost.bind(this)
  }

  async componentDidMount() {
    this.loadCommentsFromServer()
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadCommentsFromServer, 2000)
    }
  }

  componentWillUnmount() {
    this.pollInterval = null
  }

  loadCommentsFromServer = async () => {
    var user = AuthService.getCurrentUser()
    if (user) {
      var token = user.token
      if (token) {
        axios.defaults.headers.common["Authorization"] = token
      } else {
        axios.defaults.headers.common["Authorization"] = null
        /*if setting null does not remove `Authorization` header then try     
           delete axios.defaults.headers.common['Authorization'];
         */
      }
      const getReplies = await axios.get(API_URL)
      if (getReplies.data.status === "success") {
        const data = getReplies.data.data
        // console.log(data)
        this.setState({ data: data, author: user.Email })
      } else {
        window.localStorage.clear()
        this.props.history.push("/")
        window.location.reload()
      }
    } else {
      window.localStorage.clear()
      this.props.history.push("/")
      window.location.reload()
    }
  }
  onUpdateComment = (id) => {
    const oldComment = this.state.data.find((c) => c._id === id)
    if (!oldComment) return
    this.setState({
      author: oldComment.author,
      Message: oldComment.Message,
      updateId: id,
    })
  }

  onDeleteComment = (id) => {
    var user = AuthService.getCurrentUser()
    const i = this.state.data.findIndex((c) => c._id === id)
    const data = [
      ...this.state.data.slice(0, i),
      ...this.state.data.slice(i + 1),
    ]
    this.setState({ data })
    const deletePost = axios
      .delete(API_URL + `${user.id}/${id}`)
      .then((res) => {
        alert("Post deleted successfully")
      })
      .catch((error) => {
        console.log(error.response)
        alert(error.response.data.message)
      })
    // if (deletePost.status === "success") {
    //   alert("Message Deleted")
    // } else {
    //   this.setState({ error: true })
    //   console.log(deletePost)
    //   alert("There was a problem deleting the message")
    // }
    // .then((res) => res.json())
    // .then((res) => {
    //   if (!res.success) this.setState({ error: res.error })
    // }).catch((e)=>{
    //   console.
    // })
  }

  render() {
    return (
      <div className="container">
        <div className="comments">
          <h2>Posts:</h2>
          <CommentList
            data={this.state.data}
            handleDeleteComment={this.onDeleteComment}
          />{" "}
        </div>
        <div className="form">
          <CommentForm />{" "}
        </div>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    )
  }
}

export default CommentBox

// ReplyBox.js
import React, { Component } from "react"
import "whatwg-fetch"
import ReplyList from "./replyList"
import ReplyForm from "./replyForm"
import AuthService from "../services/authServices"
import axios from "axios"
import "./ReplyBox.css"
const API_URL = "https://backendguestbook.herokuapp.com/api/replies/"
class ReplyBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      error: null,
      author: "",
      Message: "",
      done: false,
      result: null,
      replyId: "",
      fetch: true,
      show: true,
    }
    this.pollInterval = false
    // this.onChangeMessage = this.onChangeMessage.bind(this)
    // this.submitPost = this.submitPost.bind(this)
  }

  async componentDidMount() {
    // if (!this.pollInterval) {
    //   this.pollInterval = setInterval(this.loadCommentsFromServer, 2000)
    // }
  }

  componentWillUnmount() {
    this.pollInterval = null
  }
  hideReplies = () => {
    this.setState({ show: true, data: [] })
  }
  loadCommentsFromServer = async () => {
    if (this.state.show) {
      this.setState({ show: false })
    }
    this.pollInterval = true
    var user = AuthService.getCurrentUser()
    var replyId
    if (this.props.location.state) {
      replyId = this.props.location.state.replyId
    } else {
      alert("Error Occured Please Try Again")
      return this.props.history.push("/post")
    }

    this.setState({ replyId: replyId })
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
      const getReplies = axios
        .get(API_URL + `${user.id}/${replyId}`)
        .then((res) => {
          const data = res.data.data
          // console.log(data)
          this.setState({ data: data, author: user.Email })
        })
        .catch((e) => {
          window.localStorage.clear()
          this.props.history.push("/post")
          window.location.reload()
        })
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
        alert("Reply deleted successfully")
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
          <h2>Replies:</h2>
          {this.state.show ? (
            <button
              onClick={() => {
                this.loadCommentsFromServer()
              }}
            >
              showReplies
            </button>
          ) : (
            <button
              onClick={() => {
                this.hideReplies()
              }}
            >
              hideReplies
            </button>
          )}
          <ReplyList
            data={this.state.data}
            handleDeleteComment={this.onDeleteComment}
          />{" "}
        </div>
        <div className="form">
          <ReplyForm replyId={this.state.replyId} />{" "}
        </div>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    )
  }
}

export default ReplyBox

// CommentBox.js
import React, { Component } from "react"
import "whatwg-fetch"
import CommentList from "./commentList"
import CommentForm from "./commentForm"
import AuthService from "../services/authServices"
import axios from "axios"
import "./commentBox.css"
const API_URL = "http://localhost:3000/api/posts/"
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
  //   onChangeMessage = (e) => {
  //     console.log(e.target.value)
  //     const newState = { ...this.state }
  //     newState[e.target.name] = e.target.value
  //     this.setState(newState)
  //   }
  //   submitPost = (e) => {
  //     var user = AuthService.getCurrentUser()
  //     e.preventDefault()
  //     if (!this.state.Message) return
  //     axios
  //       .post(API_URL + user.id, {
  //         Message: this.state.Message,
  //       })
  //       .then((res) => {
  //         this.setState({ done: true, author: user.Email })
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         this.setState({ error: true })
  //         alert("There was a problem posting a message please try again later")
  //         // window.location.href = "/"
  //       })
  //   }
  //   submitComment = (e) => {
  //     var user = AuthService.getCurrentUser()
  //     e.preventDefault()
  //     const { author, Message } = this.state
  //     if (!Message) return
  //     fetch("/api/posts/" + user.id, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: user.token,
  //       },
  //       body: JSON.stringify({ Message }),
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (!res.success)
  //           this.setState({ error: res.error.message || res.error })
  //         else this.setState({ author: "", Message: "", error: null })
  //       })
  //   }
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

  submitComment = (e) => {
    e.preventDefault()
    const { Message, updateId } = this.state
    if (!Message) return
    if (updateId) {
      this.submitUpdatedComment()
    } else {
      this.submitNewComment()
    }
  }

  submitNewComment = () => {
    var user = AuthService.getCurrentUser()
    const { author, Message } = this.state
    const data = [
      ...this.state.data,
      {
        author,
        Message,
        _id: Date.now().toString(),
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ]
    this.setState({ data })
    fetch("/api/posts/" + user.id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Message }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success)
          this.setState({ error: res.error.message || res.error })
        else this.setState({ author: "", Message: "", error: null })
      })
  }

  submitUpdatedComment = () => {
    var user = AuthService.getCurrentUser()
    const { Message } = this.state
    if (!this.state.Message) return
    const posting = axios
      .put(API_URL + user.id, {
        Message: Message,
      })
      .then((res) => {
        alert("Post updated successfully")
      })
      .catch((error) => {
        console.log(error.response)
        alert(error.response.data.message)
      })
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

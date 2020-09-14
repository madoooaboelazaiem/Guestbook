import React, { Component } from "react"
import { Switch, Route, Link } from "react-router-dom"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import Login from "./components/login"
import Register from "./components/register"
import Comment from "./components/commentBox"
import AuthService from "./services/authServices"
import ReplyBox from "./components/replyBox"

class App extends Component {
  constructor(props) {
    super(props)
    this.logOut = this.logOut.bind(this)

    this.state = {
      currentUser: undefined,
    }
  }
  componentDidMount() {
    const user = AuthService.getCurrentUser()

    if (user) {
      this.setState({
        currentUser: user,
      })
    }
  }

  logOut() {
    AuthService.logout()
  }
  render() {
    const { currentUser } = this.state
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Guestbook
          </Link>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/post"} className="nav-link">
                  Posts
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/login"} className="nav-link" onClick={this.logOut}>
                  Sign Out
                </Link>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Sign In
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/post" component={Comment} />
            <Route path="/replies" component={ReplyBox} />
            <Route exact path="/register" component={Register} />
            {/* <Route exact path="/post" component={Post} /> */}
          </Switch>
        </div>
      </div>
    )
  }
}

export default App

import React, { Component } from "react"
import Form from "react-validation/build/form"
import Input from "react-validation/build/input"
import CheckButton from "react-validation/build/button"
import AuthService from "../services/authServices"

import { isEmail } from "validator"

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    )
  }
}

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    )
  }
}

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)

    this.state = {
      Email: "",
      Password: "",
      loading: false,
      message: "",
    }
  }

  onChangeEmail(e) {
    this.setState({
      Email: e.target.value,
    })
  }

  onChangePassword(e) {
    this.setState({
      Password: e.target.value,
    })
  }

  handleLogin(e) {
    e.preventDefault()

    this.setState({
      message: "",
      loading: true,
    })

    this.form.validateAll()

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.Email, this.state.Password).then(
        () => {
          this.props.history.push("/post")
          window.location.reload()
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()

          this.setState({
            loading: false,
            message: resMessage,
          })
        }
      )
    } else {
      this.setState({
        loading: false,
      })
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleLogin}
            ref={(c) => {
              this.form = c
            }}
          >
            <div className="form-group">
              <label htmlFor="Email">Email</label>
              <Input
                type="text"
                className="form-control"
                name="Email"
                value={this.state.Email}
                onChange={this.onChangeEmail}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="Password">Password</label>
              <Input
                type="password"
                className="form-control"
                name="Password"
                value={this.state.Password}
                onChange={this.onChangePassword}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                this.checkBtn = c
              }}
            />
          </Form>
        </div>
      </div>
    )
  }
}

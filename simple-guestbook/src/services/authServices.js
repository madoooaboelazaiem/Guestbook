import axios from "axios"

const API_URL = "http://localhost:3000/api/users/"

class AuthService {
  login(Email, Password) {
    return axios
      .post(API_URL + "login", {
        Email,
        Password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data))
        }

        return response.data
      })
  }

  logout() {
    localStorage.removeItem("user")
    window.localStorage.clear()
    this.props.history.push("/")
  }

  register(Username, Email, Password) {
    return axios.post(API_URL + "registration", {
      Username,
      Email,
      Password,
    })
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"))
  }
}

export default new AuthService()

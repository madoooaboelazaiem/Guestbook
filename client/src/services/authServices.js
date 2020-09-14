import axios from "axios"

const API_URL = "https://backendguestbook.herokuapp.com/api/users/"

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

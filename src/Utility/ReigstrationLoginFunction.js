import axios from 'axios'
import { BACKEND_URL } from '../Configuration/config'

export const logoutClearSession = () => {
  return axios.get(BACKEND_URL+'/logout')
    .then(res => {
      // console.log(res)
    })
}
export const changePass = (temp_fields) => {
  return axios.post(BACKEND_URL+'/UserProfileChangePass', {
    oldpass: temp_fields.oldpass,
    newpass: temp_fields.newpass,
  }).then(response => {
    if (response.status === 200) {
    }
    return response.status
  }).catch(error => {
    //console.log(error.response.status)
    return error.response.status
  })
}

export const changeName = (temp_fields) => {
  return axios.post(BACKEND_URL+'/changeName', {
    name: temp_fields.name
  }).then(response => {
    if (response.status === 200) {
    }
    return response.status
  }).catch(error => {
    //console.log(error.response.status)
    return error.response.status
  })
}

export const registerPost = temp_fields => {
  const payLoad = {
    firstname: temp_fields.firstname,
    lastname: temp_fields.lastname,
    email: temp_fields.email,
    password: temp_fields.password,
    dob:temp_fields.dob,
    mobile:temp_fields.mobile
  }
  console.log("payload",payLoad);
  return axios.post(BACKEND_URL+'/signup', payLoad).then(response => {
    if (response.status === 200) {
      localStorage.setItem('accesstoken', response.data)
    }
    return response.status
  }).catch(error => {
    //console.log(error.response.status)
    return error.response.status
  })
}

export const loginPost = temp_fields => {
  return axios.post(BACKEND_URL+'/signIn', {
    email: temp_fields.email,
    password: temp_fields.password,
  }).then(response => {
    console.log("login result status: " , response)
    // log-in possible only when server says "S"
    if (response.data.isAuth==true) {
      localStorage.setItem('accesstoken',response.data)
      localStorage.setItem('userName',response.data.name)
      localStorage.setItem('email',response.data.email)
      localStorage.setItem('rewardPoints',response.data.rewardPoints)
    }
    return response.data
  }).catch(error => {
    console.log("error message for login: " , error)
  })
}

export const verifyLogin = () => {
  return axios.get(BACKEND_URL+'/verifyuser')
    .then(response => {
      if (response.data === "S") {
        localStorage.setItem('accesstoken', response.data)
      } else {
        localStorage.removeItem('accesstoken')
      }
    })
    .catch(error => console.log("error", error))
}

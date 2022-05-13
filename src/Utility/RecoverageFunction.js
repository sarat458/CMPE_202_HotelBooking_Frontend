import axios from 'axios'
import { BACKEND_URL } from '../Configuration/config'

export const sendcodePost = email_value => {
    return axios.post(BACKEND_URL+'/recovery',{
        email: email_value
    }).then(response => {
        if(response.data === "S1") {
            console.log(response.data)
            localStorage.setItem('checkToken',response.data)
        }
        return response.data
    }).catch(error => {
        console.log(error.response.status)
        return error.response.status
    })
}


export const checkCodePost = temp_fields => {
    return axios.post(BACKEND_URL+'/checkcode', {
        access_code: temp_fields.access_code,
        email: temp_fields.email
    }).then(response => {
        if(response.data === "S") {
            localStorage.setItem('1',response.data)
        }
        return response.data
    }).catch(error => {
        //console.log(error.response.status)
        return error.response.data
    })
}

export const changePost = temp_fields => {
    return axios.post(BACKEND_URL+'/changepass', {
        email: temp_fields.email,
        password: temp_fields.password,
        confirmpassword: temp_fields.repassword
    }).then(response => {
        if(response.data === "S") {
            localStorage.setItem(response.data)
        }
        return response.data
    }).catch(error => {
        //console.log(error.response.status)
        return error.response.data
    })
}
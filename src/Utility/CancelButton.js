import axios from 'axios'
import { BACKEND_URL } from '../Configuration/config'


export const cancelTransaction = (temp_fields) => {
        console.log("check",temp_fields.bookingID);
        return axios.put(BACKEND_URL+'/cancelBooking', {
            bookingID: temp_fields.bookingID
        }).then(response => {
        if(response.status === 200) {
        }
        return response.status
    }).catch(error => {
        //console.log(error.response.status)
        return error.response.status
    })
}
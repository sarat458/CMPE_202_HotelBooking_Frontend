import axios from 'axios'
import { BACKEND_URL } from '../Configuration/config'


export const cancelTransaction = (temp_fields) => {
        return axios.post(BACKEND_URL+'/reservations/cancellation', {
            transaction_id: temp_fields.transaction_id
        }).then(response => {
        if(response.status === 200) {
        }
        return response.status
    }).catch(error => {
        //console.log(error.response.status)
        return error.response.status
    })
}
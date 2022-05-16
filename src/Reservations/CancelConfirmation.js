import axios from 'axios';
import React from 'react';
import {withRouter} from 'react-router-dom'
import {
	Button, Modal, ModalHeader,
	ModalBody, ModalFooter
} from 'reactstrap'
import { BACKEND_URL } from '../Configuration/config';

import {cancelTransaction} from '../Utility/CancelButton'
import "./Reservations.css";

class CancelConfirmation extends React.Component {
	constructor(props) {
		super(props);

		this.state={
			modal: false,
			id: props.id
		}

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			...this.state,
			modal: !this.state.modal
		})
	}

	handleSubmit = (event) => {
	    // console.log('Register clicked')
	    event.preventDefault()
	    // console.log(event.target.value)
	    //   cancelTransaction(temp_fields).then(response => {
	    //   	console.log(response)
	    //     if (response === 200) {
	    //       window.location.reload();
	    //     } else if (response === 400) {
	    //     }
	    //   })
		console.log(this.props.bookingId);
		 axios.put(BACKEND_URL+'/cancelBooking', {
            bookingID: this.props.bookingId
        }).then(response => {
			console.log(response);
			if (response.status === 200) {
				      window.location.reload();
					  const userId = JSON.parse(localStorage.getItem("accesstoken")).id
					  const rewards = this.props.price
					  axios.put(BACKEND_URL+"/updateRewardPoints/"+userId+"/"+rewards)
					  		.then((res)=>{
								  console.log(res);
							  })
							  .catch((err)=>{
								  console.log(err);
							  })
				    } else if (response.status === 400) {
				    }
    }).catch(error => {
        //console.log(error.response.status)
        return error.response.status
    })
	    
  	}

	render() {
		return (
			<div>
			<Button className="reservations-button" color="danger" onClick={this.toggle}> Cancel </Button>
			<Modal isOpen={this.state.modal} toggle={this.toggle} centered>
				<ModalHeader toggle={this.toggle}> 
					Cancel Confirmation 
					&nbsp;
					<img className="reservations-image" src="https://www.wiki.sc4devotion.com/images/3/3d/Wiki_warning_amber.png" alt="warning"/>
				</ModalHeader>

				<ModalBody>
					<p> Once you cancel your booking, it cannot be undone. If yes, then you will be emailed a cancellation receipt. </p> Are you sure you want to cancel this booking?
				</ModalBody>

				<ModalFooter>
					<Button color="primary" onClick={this.handleSubmit} value={this.state.id}> Yes </Button>
					<Button color="secondary" onClick={this.toggle}> No </Button>
				</ModalFooter>
			</Modal>
			</div>
		)
	}
}

export default withRouter(CancelConfirmation);
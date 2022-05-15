import React from 'react';

import axios from 'axios';

import {withRouter} from 'react-router-dom'

import {
	Button, Modal, ModalHeader,
	ModalBody, Table
} from 'reactstrap'
import { BACKEND_URL } from '../Configuration/config';

class MoreInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state={
			modal: false,
			id: props.id,
			room_history: []
		}

		this.toggle = this.toggle.bind(this);
	}

// Getting the info from the query and formatting it correctly
// Not entirely sure to recognize which button is getting pressed though
componentDidMount() {
    //   var that = this
	//   console.log("check")
    //   axios.get(BACKEND_URL+'/bookingId/'+this.props.bookingId)
    //   .then((viewres) =>{
	// 	  console.log("check",viewres);
    //   	var room_info = []
    //   	// Group elements of viewres.data into reservations array. reservations is an array that contains multiple arrays that all hold
    //   	// reservations of the same transaction_id. One array per one transaction. Dunno whether or not you have to do it like this.
    //   	for (var i = 0; i < viewres.data.length; i++) {
    //   		var booking_id = viewres.data[i].transaction_id
    //   		var room_num = viewres.data[i].room_number
    //   		var bed_type = viewres.data[i].bed_type
    //   		var room_price = viewres.data[i].price

    //   		room_info[i] = {booking_id, room_num, bed_type, room_price}
    //   		}

    //   	that.setState({
    //         room_history: room_info
    //       })
    //   })
  }

	toggle () {
		this.setState({
			...this.state,
			modal: !this.state.modal
		})
	}

	getDetails= ()=>{
		var that = this
	  console.log("check")
      axios.get(BACKEND_URL+'/bookingId/'+this.props.bookingId)
      .then((viewres) =>{
		  console.log("check",viewres);
      	var room_info = []
      	// Group elements of viewres.data into reservations array. reservations is an array that contains multiple arrays that all hold
      	// reservations of the same transaction_id. One array per one transaction. Dunno whether or not you have to do it like this.
      	for (var i = 0; i < viewres.data.length; i++) {
      		var booking_id = viewres.data[i].bookingID
      		var room_num = viewres.data[i].roomCount
      		var bed_type = viewres.data[i].roomType
      		var room_price = viewres.data[i].roomPrice

      		room_info[i] = {booking_id, room_num, bed_type, room_price}
      		}

      	that.setState({
            room_history: room_info
          })
      })
	}

// Kind of like how it is in RewardHistory. Map object to indices and put this in the body of render()
// Data that gets rendered should depend on which toggle you press. Not sure how to identify that.
  	renderRoomsTableData() {
		  console.log(this.state.room_history);
		  let res=[];
		this.state.room_history.map((rooms, index) => {
			const {booking_id, room_num, bed_type, room_price} = rooms
			if(room_num===0) return;					
				res.push(<tr key={bed_type}>
					<td>{bed_type}</td>
					<td>{room_num}</td>
					<td>${room_price}</td>
				</tr>)
				
		})
		console.log(res);
		return res;
	}

// Currently the toggle renders the same data. Not entirely sure how to get it to render different data depending on which toggle you press
	render() {
		return (
			<div>
				<Button color="lightgray" onClick={this.toggle}> 
					<img className="reservations-image" src="https://cdn1.iconfinder.com/data/icons/education-set-4/512/information-512.png" alt="details" onClick={this.getDetails} />
				</Button>
				<Modal isOpen={this.state.modal} toggle={this.toggle} centered>
					<ModalHeader toggle={this.toggle}> Room Information </ModalHeader>

					<ModalBody>
						<Table className="reservations-detail-table-text"> 
							<thead>
								<tr>
									<th> Room Type </th>
									<th> Count </th>
									<th> Price </th>
								</tr>
							</thead>
							<tbody>
								{this.renderRoomsTableData()}
							</tbody>
						</Table>
					</ModalBody>

				</Modal>
			</div>
		)
	}
}

export default withRouter(MoreInfo);
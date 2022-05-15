import React from 'react';
import {
	Table, Button,
	Container, Row, Col
} from 'reactstrap';
import homeImage from './homeImage.jpg';
import axios from 'axios';
import "./Reservations.css";
import MoreInfo from './MoreInfo';
import CancelConfirmation from './CancelConfirmation';
import { BACKEND_URL } from '../Configuration/config';


var pageStyle = {
	width: "100%",
	height: "100vh",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,

};

class Reservations extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			reservations: [],
			roominfo: [],
			transaction_id: ''
		}
	}

	componentWillMount() {
		var that = this
		console.log(JSON.parse(localStorage.getItem('accesstoken')).id);
		axios.get(BACKEND_URL+'/getbookings/'+JSON.parse(localStorage.getItem('accesstoken')).id)
			.then( (viewres) => {
				let reservations = [];
				let data= viewres.data.results;
				for(let i=0;i<data.length;i++){
					if(data[i].used!==undefined) continue;
					data[i].used=true;
					let bookingObj={
						rooms:[],
						hotelName:"",
						status:"",
						bookingId:"",
						checkinDate:"",
						checkoutDate:"",
						price:0
					};
					bookingObj.rooms.push(data[i]);
					bookingObj.hotelName=data[i].hotelName;
					bookingObj.status=data[i].bookingStatus;
					bookingObj.checkinDate=data[i].checkInDate;
					bookingObj.checkoutDate=data[i].checkOutDate;
					bookingObj.price=data[i].amountPaid;
					bookingObj.bookingId=data[i].bookingID;
					for(let j=i+1;j<data.length;j++){
						if(data[j].bookingID==data[i].bookingID){
							data[j].used=true;
							bookingObj.rooms.push(data[j]);
						}
					}
					reservations.push(bookingObj);
				}

				this.setState({reservations:reservations});
			})
	}


	redirectToHome() {
		this.props.history.push('/')
	}

	modifyRoom = (reservation) => (event) => {
		event.preventDefault()
		localStorage.setItem("modifyBooking",JSON.stringify(reservation));
		const info = reservation
		const queryString = `date_in=${info.checkinDate}&date_out=${info.checkoutDate}
								&hotel_id=${info.hotelName}&transaction_id=${info.bookingId}`
		localStorage.setItem("transId",info.bookingId);
		this.props.history.push({
			pathname: `/ModifyRoomPage`,
			search: `?${queryString}`,
		})
	}

	render() {
		const renderReservationsTableData = (
			<tbody>
				{
					this.state.reservations.map((reservation, index) => {
						console.log(reservation);
						const { bookingId, checkinDate, checkoutDate, hotelName, price, status } = reservation //destructuring
						if (status === 'Active') {
							return (
								<tr key={index + 11}>
									<td>{bookingId}</td>
									<td>{checkinDate.toString().slice(0,10)}</td>
									<td>{checkoutDate.toString().slice(0,10)}</td>
									<td>{hotelName}</td>
									<td style={{color:"green"}}><strong>${price.toFixed(2)}</strong></td>
									<td> <Button className="reservations-button" color="warning" value={reservation} onClick={this.modifyRoom(reservation)} > Modify </Button>
										<CancelConfirmation bookingId={bookingId} /> </td>
									<td style={{color:"green"}}><strong>Active</strong></td>
									<td> <MoreInfo bookingId={bookingId} /> </td>
								</tr>
							)
						} 
						else {
							return (
								<tr key={index + 22}>
									<td>{bookingId}</td>
									<td>{checkinDate.toString().slice(0,10)}</td>
									<td>{checkoutDate.toString().slice(0,10)}</td>
									<td>{hotelName}</td>
									<td style={{color:"red"}}><s>${price}</s></td>
									<td>       </td>
									<td style={{color:"red"}}>Cancelled</td>
									<td> <MoreInfo bookingId={bookingId} /> </td>
								</tr>
							)
						}
					})
				}
			</tbody>
		)

		const reservationPage = (

			<div className="reservation-form-container col-lg-12 dark-tint">
				<br />
				<br />
				<br />
				<br />
				<br />
				<div>
					<Container>
						<Row>
							<Col>
								<div className="reservations-card" style={{width:"110%",height:"100%"}}>
									<div className="reservations-card-body reservations-inner-card">
										<br />
										<div className="reservations-center-title"> <h2> My Reservations </h2> </div>
										<br />
										<div className="reservations-table-wrapper-scroll-y reservations-scrollbar">
											<Table hover>
												<thead>
													<tr>
														<th>Booking ID</th>
														<th>Check-in</th>
														<th>Check-out</th>
														<th>Hotel</th>
														<th>Total Price</th>
														<th>Modify/Cancel</th>
														<th>Status</th>
													</tr>
												</thead>
												{renderReservationsTableData}
											</Table>
										</div>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		)

		return (
			<div className="col-lg-12 reservations-container col-auto " style={pageStyle}>
				{reservationPage}
			</div>
		);
	}
}

export default Reservations;
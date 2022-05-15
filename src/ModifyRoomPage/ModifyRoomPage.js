import React from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Table, Button } from 'reactstrap';

import { getHotelInfoWithTransactionID } from '../Utility/HotelSearchFunction'
import { convertTimestampToString } from '../Utility/Conversion'

import HotelInfoCard from './Components/HotelInfoCard'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'
import {BACKEND_URL} from '../Configuration/config'


// [{bed_type:"single",price:123.3},{image:"https://media.istockphoto.com/photos/marriott-walnut-creek-picture-id1067000654?k=20&m=1067000654&s=612x612&w=0&h=dazJ7HWfdBz3c9593B53TS_lMmvgn2ax1HOT7OLiMuk=",capacity:2,taken_quantity:2,available_quantity:10}],
// 				[{bed_type:"Double",price:223.3},{image:"https://media.istockphoto.com/photos/marriott-walnut-creek-picture-id1067000654?k=20&m=1067000654&s=612x612&w=0&h=dazJ7HWfdBz3c9593B53TS_lMmvgn2ax1HOT7OLiMuk=",capacity:2,taken_quantity:1,available_quantity:11}],
// 				[{bed_type:"Suite",price:323.3},{image:"https://media.istockphoto.com/photos/marriott-walnut-creek-picture-id1067000654?k=20&m=1067000654&s=612x612&w=0&h=dazJ7HWfdBz3c9593B53TS_lMmvgn2ax1HOT7OLiMuk=",capacity:2,taken_quantity:0,available_quantity:13}]
class ModifyRoomPage extends React.Component {
	constructor(props) {
		super(props);

		const params = new URLSearchParams(this.props.location.search);
		const hotel_id = params.get('hotel_id')
		const date_in = moment(params.get('date_in'), ('YYYY-MM-DD'))
		const date_out = moment(params.get('date_out'), ('YYYY-MM-DD'))
		const reservation_days = date_out.diff(date_in, 'days')

		// const transaction_id = params.get('transaction_id')
		// const oldTotalPrice = this.state.oldTotalPrice.toString()
		// const oldAmountPaid = this.state.oldAmountPaid.toString()
		// const transaction_id = this.state.transaction_id.toString()
		// const totalPriceWithTax = this.state.totalPriceWithTax.toString()
		// const cancellationFee = this.state.cancellationFee.toString()
		// const date_in = this.state.date_in.format('YYYY-MM-DD').toString()
		// const date_out = this.state.date_out.format('YYYY-MM-DD').toString()
		// const hotel_id = this.state.hotel_id.toString()
		// const oldRooms = this.state.roomsFromTransaction
		this.state = {
			hotel: {
				results:{
					// "id":1,"location":"san jose","zipcode":"95126","description":"Marriott International, Inc. is a Fortune 500 company with more than 7,000 hotels and resorts in 130 countries and territories—including many in the Capital Region of Washington, D.C., Maryland, and Virginia.The company, headquartered in Bethesda, Maryland, was founded by J. Willard and Alice S. Marriott in 1927, and their son, J.W. “Bill” Marriott, Jr., spent more than 50 years shaping it into one of the world’s leading hospitality companies. Marriott is consistently recognized as one of the “Best Places to Work” and leads the industry with innovations that elevate style, design, and technology.","priceRange":"100-200$","phone_number":"6695326478","amenities":"Wifi,Pool,AC,TV","latitude":"37.3226442","longitude":"-121.913165","state":"CA","country":"USA","name":"Marriot Inn","address":"754 the alameda","city":"San Jose","min_price":"81.23","max_price":"100.45"
				}
			},
			rooms: {
				results:[{bed_type:"Single",price:126.1,capacity:2,quantity:10,desired_quantity:0},
				{bed_type:"Double",price:196.1,capacity:2,quantity:5,desired_quantity:0},
				{bed_type:"Suite",price:326.1,capacity:2,quantity:4,desired_quantity:0}]
			},
			hotel_id,
			date_in,
			date_out,
			transaction_id:0,
			reservation_days:4,
			collapse: false,
			availableRooms: [],
			totalPriceWithoutTax: 0.00,
			totalPriceWithTax: 0.00,
			cancellationFee: 0.00,
			oldTotalPrice:0,
			oldAmountPaid:0,
			totalPriceWithTax:0,
			cancellationFee:0,
			roomsMap: [
				
			],
			transaction_dateIn:moment("2022-10-12","YYYY-MM-DD"),
			transaction_dateOut:moment("2022-10-23","YYYY-MM-DD")
		};
	}

	componentDidMount() {
		console.log("Check");
		this.fetchSearchResult()
	}

	async fetchSearchResult() {
		const params = new URLSearchParams(this.props.location.search);
		const transaction_id = parseInt(params.get('transaction_id'))
		const date_in = moment(params.get('date_in'), ('YYYY-MM-DD'))
		const date_out = moment(params.get('date_out'), ('YYYY-MM-DD'))
		const reservation_days = date_out.diff(date_in, 'days')
		
		const roomsFromTransaction = JSON.parse(localStorage.getItem("modifyBooking"));
		const hotelQuery = BACKEND_URL+`/searchhotelid/`+roomsFromTransaction.rooms[0].hotelId;
		const query = BACKEND_URL+"/roomsavailability/"+roomsFromTransaction.rooms[0].hotelId+"/"+date_in+"/"+date_out;
		const rooms = (await axios.get(query)).data
		const realrooms = (await axios.get(query)).data
		const data = (await axios.get(hotelQuery)).data
		let hotel = {
			results : data[0]
		}
		const realhotel = (await axios.get(query)).data
		const transaction_date_in = convertTimestampToString(roomsFromTransaction.checkinDate)
		const transaction_date_out = convertTimestampToString(roomsFromTransaction.checkoutDate)
		const oldTotalPrice = parseFloat(roomsFromTransaction.price)
		const oldAmountPaid = parseFloat(roomsFromTransaction.price)

		let availableRooms = [...this.state.availableRooms]

		let totalPriceWithoutTax = 0.00

		const roomsMap = new Map();

		// pushing unique available rooms (type, price) as a key and available quantity to hashmap
		if (realrooms && realrooms.length > 0) {
			realrooms.forEach((eachRealRoomResult) => {
				const key = "" + eachRealRoomResult.bed_type.toString()
				const value = { available_quantity: eachRealRoomResult.quantity, image: eachRealRoomResult.images, capacity: eachRealRoomResult.capacity, taken_quantity: 0, bed_type: eachRealRoomResult.bed_type, price: eachRealRoomResult.price }
				roomsMap.set(key, value)
			})
		}

		// when user looking at dates that match with the dates from transaction
		// pushing taken rooms (type, price) as a key and taken quantity to hashmap
		// also calculate total price of previous transaction
		if (roomsFromTransaction && roomsFromTransaction.rooms.length > 0 && transaction_date_in === this.state.date_in.format('YYYY-MM-DD') && transaction_date_out === this.state.date_out.format('YYYY-MM-DD')) {
			roomsFromTransaction.rooms.forEach((eachRoomFromTransaction) => {
				//console.log(eachRoomFromTransaction);
				const key = "" + eachRoomFromTransaction.roomType.toString()
				const value = { taken_quantity: eachRoomFromTransaction.roomCount, image: "https://media.istockphoto.com/photos/marriott-walnut-creek-picture-id1067000654?k=20&m=1067000654&s=612x612&w=0&h=dazJ7HWfdBz3c9593B53TS_lMmvgn2ax1HOT7OLiMuk=", capacity: 2, bed_type: eachRoomFromTransaction.roomType, price: eachRoomFromTransaction.roomPrice }
				if (roomsMap.get(key)) {
					let currentObjValue = roomsMap.get(key)
					currentObjValue = {...currentObjValue, taken_quantity: parseInt(eachRoomFromTransaction.roomCount)}
					roomsMap.set(key, currentObjValue)
				} else {
					roomsMap.set(key, value)
				}
				console.log("Check 1",roomsMap.get(key));
				totalPriceWithoutTax = totalPriceWithoutTax + (roomsMap.get(key).price * eachRoomFromTransaction.roomCount * 1.0)
			})
		}

		for (const entry of roomsMap) {
			let value = entry[1]
			if (entry[1].available_quantity > entry[1].taken_quantity) {
				value.option_quantity = entry[1].available_quantity
				roomsMap.set(entry[0], value)
			} else {
				value.option_quantity = entry[1].taken_quantity
				roomsMap.set(entry[0], value)
			}
		}

		// console.log("roomsMap", roomsMap)
		// calculate total prices, cancellationfee, salestax
		totalPriceWithoutTax = (totalPriceWithoutTax * 1.0 * reservation_days)
		const salesTax = (totalPriceWithoutTax * .1)
		const totalPriceWithTax = (totalPriceWithoutTax * 1.1)
		const cancellationFee = (totalPriceWithoutTax * .2)
		let r = {
			results:rooms
		}
		let h= {
			results : hotel
		}
		console.log(r,h);
		this.setState({rooms:r,hotel,roomsMap:roomsMap,transaction_dateIn: moment(transaction_date_in, ('YYYY-MM-DD')), transaction_dateOut: moment(transaction_date_out, ('YYYY-MM-DD')), oldTotalPrice, availableRooms
		, totalPriceWithoutTax, totalPriceWithTax, cancellationFee, salesTax, transaction_id, oldAmountPaid,date_in, date_out, reservation_days});
		// this.setState({
		// 	rooms:r, hotel:h, realrooms:r, realhotel:h, roomsFromTransaction, transaction_dateIn: moment(transaction_date_in, ('YYYY-MM-DD')), transaction_dateOut: moment(transaction_date_out, ('YYYY-MM-DD')), oldTotalPrice, availableRooms
		// 	, totalPriceWithoutTax, totalPriceWithTax, cancellationFee, salesTax, transaction_id, oldAmountPaid, roomsMap, date_in, date_out, reservation_days
		// })
	}

	componentDidUpdate(prevProps) {
		if (prevProps.location.search !== this.props.location.search) {
			this.fetchSearchResult()
		}
	}

	roomSearch = (event) => {
		const queryString = `?date_in=${this.state.date_in.format('YYYY-MM-DD')}&date_out=${this.state.date_out.format('YYYY-MM-DD')}`+
			`&hotel_id=${this.state.hotel_id}`+
			`&transaction_id=${this.state.transaction_id}`

		this.props.history.push({
			pathname: `/ModifyRoomPage`,
			search: `${queryString}`,
		})
	}

	toggle = () => {
		this.setState(state => ({ collapse: !state.collapse }));
	}

	Checkout = (event) => {
		event.preventDefault()

		// roomInfo[0] contains bed_type, price
		// roomInfo[1] contains image, capacity, taken_quantity, available_quantity
		let rooms = []
		for (const roomInfo of this.state.roomsMap) {
			// if (roomInfo[1].taken_quantity && roomInfo[1].taken_quantity > 0) {
				rooms.push({ bed_type: roomInfo[1].bed_type.toString(), price: roomInfo[1].price, quantity: parseInt(roomInfo[1].taken_quantity) })
			// }
		}
		const oldTotalPrice = this.state.oldTotalPrice.toString()
		const oldAmountPaid = this.state.oldAmountPaid.toString()
		const transaction_id = this.state.transaction_id.toString()
		const totalPriceWithTax = this.state.totalPriceWithTax.toString()
		const cancellationFee = this.state.cancellationFee.toString()
		const date_in = this.state.date_in.format('YYYY-MM-DD').toString()
		const date_out = this.state.date_out.format('YYYY-MM-DD').toString()
		const hotel_id = this.state.hotel_id.toString()
		const oldRooms = this.state.roomsFromTransaction

		this.props.history.push({
			pathname: `/Checkout`,
			state: {
				totalPriceWithTax,
				cancellationFee,
				date_in,
				date_out,
				rooms: JSON.stringify(rooms),
				hotel_id,
				transaction_id,
				oldTotalPrice,
				oldAmountPaid,
				oldRooms: JSON.stringify(oldRooms)
			}
		})
	}

	handleEachRoomQuantity = (roomInfoForRoomMap) => (event) => {
		event.preventDefault()

		const { value } = event.target
		let { roomsMap } = this.state

		let updateTakenQuantity ;
		for(let room of roomsMap){
			if(room[1].bed_type==roomInfoForRoomMap[1].bed_type){
				updateTakenQuantity=room;
				break;
			}
		}
		updateTakenQuantity[1].taken_quantity=value;
		//roomsMap.set(roomInfoForRoomMap[0], updateTakenQuantity)

		let totalPriceWithoutTax = 0.00

		for (const roomInfo of this.state.roomsMap) {
			if (roomInfo[0] === roomInfoForRoomMap[0]) {
				totalPriceWithoutTax = totalPriceWithoutTax + (roomInfo[1].price * parseFloat(value))
			} else {
				if (roomInfo[1].taken_quantity) {
					totalPriceWithoutTax = totalPriceWithoutTax + (roomInfo[1].price * roomInfo[1].taken_quantity)
				} else {
					totalPriceWithoutTax = totalPriceWithoutTax + 0.00
				}
			}
		}
		totalPriceWithoutTax = parseFloat(totalPriceWithoutTax * this.state.reservation_days)
		const salesTax = (totalPriceWithoutTax * .1)
		const totalPriceWithTax = (totalPriceWithoutTax * 1.1)
		const cancellationFee = (totalPriceWithoutTax * .2)

		this.setState({
			roomsMap, totalPriceWithoutTax, totalPriceWithTax, cancellationFee, salesTax
		});
	}

	createAvailableRooms(index) {
		let options = []
		// when user looking at dates in and out which are equal to reservation ones
		if (this.state.transaction_date_in === this.state.date_in.format('YYYY-MM-DD') && this.state.transaction_date_out === this.state.date_out.format('YYYY-MM-DD')) {
			// display rooms user

		}
		for (let i = 0; i <= index; i++) {
			options.push(<option key={i}>{i}</option>)
		}

		return options
	}

	createRoomCards() {
		let result = []
		// roomInfo[0] contains bed_type, price
		// roomInfo[1] contains image, capacity, taken_quantity, available_quantity
		for (const roomInfo of this.state.roomsMap) {
			console.log("Check",roomInfo);
			result.push(
				<div className="col-lg-4 mb-5" key={roomInfo[1].image}>
					<div className={(roomInfo[1].taken_quantity && roomInfo[1].taken_quantity > 0) ? "room-card-active block-44" : "room-card-inactive block-44"}>
						<div className="room-page-image">
							<img src="https://media.istockphoto.com/photos/marriott-walnut-creek-picture-id1067000654?k=20&m=1067000654&s=612x612&w=0&h=dazJ7HWfdBz3c9593B53TS_lMmvgn2ax1HOT7OLiMuk=" alt={roomInfo[1].image} />
						</div>
						<div className="text">
							<h2>{roomInfo[1].bed_type}</h2>
							<div className="price"><sup className="room-page-room-price">$</sup><span className="room-page-room-price">{roomInfo[1].price}</span><sub>/per night</sub></div>
							<ul className="specs">
								<li><strong>Ammenities:</strong> Closet with hangers, HD flat-screen TV, Telephone</li>
								<li><strong>Capacity Per Room:</strong> {roomInfo[1].capacity}</li>
							</ul>
							<div >
								<strong># Of Rooms </strong>
								<select className="room-page-room-quantity-dropdown" name={JSON.stringify(roomInfo[0])} value={roomInfo[1].taken_quantity} onChange={this.handleEachRoomQuantity(roomInfo)}>
									{this.createAvailableRooms(roomInfo[1].available_quantity)}
								</select>
							</div>
						</div>
					</div>
				</div>
			)
			// console.log("roomInfo", roomInfo)
		}
		return result
	}

	createSummary() {
		let result = []
		if(this.state.roomsMap===null) return;
		// roomInfo[0] contains bed_type, price
		// roomInfo[1] contains image, capacity, taken_quantity, available_quantity
		for (const roomInfo of this.state.roomsMap) {
			if (roomInfo[1].taken_quantity && roomInfo[1].taken_quantity > 0) {
				result.push(
					<tr key={roomInfo[1].image}>
						<td>{roomInfo[1].bed_type}</td>
						<td>{roomInfo[1].capacity}</td>
						<td>${roomInfo[1].price}</td>
						<td>{roomInfo[1].taken_quantity} </td>
						<td>$ {roomInfo[1].taken_quantity * roomInfo[1].price}</td>
					</tr>
				)
			} else {
				result.push(
					<tr key={roomInfo[1].image}>
					</tr>)
			}
		}
		return result
	}

	render() {

		if (!this.state.hotel.results) {
			return (
				<div className="hotel-search-container"> Loading </div>
			);
		}

		const checkOut = (
			<div className="modify-room-page-checkout-description">

				<Table borderless>
					<thead>
						<tr>
							<th>Room Type</th>
							<th>Capacity</th>
							<th>Price</th>
							<th>Quantity</th>
							<th>Total</th>
						</tr>
					</thead>

					{
						<tbody>
							{
								this.createSummary()
							}
							<tr className="hr-row">
								<td><hr></hr> </td>
								<td><hr></hr> </td>
								<td><hr></hr> </td>
								<td><hr></hr> </td>
								<td><hr></hr> </td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td><span> Total Room Price </span><span style={{ color: '#38af7b' }}><strong>({this.state.reservation_days} {this.state.reservation_days === 1 ? 'Night' : 'Nights'})</strong></span></td>
								<td> $ {parseFloat(this.state.totalPriceWithoutTax)}</td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td> Sales Tax </td>
								<td> $ {parseFloat(this.state.totalPriceWithoutTax*0.1)}</td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td style={{ color: '#3b73d3' }}><strong> Estimated Total </strong></td>
								<td><strong>$ {(this.state.totalPriceWithoutTax*1.10)} </strong></td>
							</tr>
							<tr>
								<td> </td>
								<td> </td>
								<td> </td>
								<td style={{ color: '#f977a1' }}> Estimated Cancellation Fee </td>
								<td> $ {this.state.cancellationFee}</td>
							</tr>

						</tbody>
					}
				</Table>
				<Button disabled={(this.state.transaction_dateIn.format('YYYY-MM-DD') === this.state.date_in.format('YYYY-MM-DD') && this.state.transaction_dateOut.format('YYYY-MM-DD') === this.state.date_out.format('YYYY-MM-DD') && this.state.totalPriceWithTax === this.state.oldTotalPrice) || parseInt(this.state.totalPriceWithTax) === 1} className="home-submit-button btn btn-primary py-3 px-4" onClick={this.Checkout}>Modify Checkout</Button>
			</div>
		)



		const roomPage = (

			<div className="room-page-container">
				<div className="room-page-rooms-container">
					<div>
						{
							this.state.rooms.results!==undefined && this.state.rooms.results.length > 0 ?
								<div>
									<hr></hr>

									<div className="col-lg-12 room-page-rooms custom-row container">
										{
											this.createRoomCards()
										}
									</div>
								</div> :
								<div>no result</div>
						}

						<hr></hr>
					</div>
				</div>
			</div>
		)

		return (

			<div>
				<div className="d-flex justify-content-center">
					<div className="block-32">

						<div className="row">
							<div className="col-md-6 mb-3 mb-lg-0 col-lg-12">
								<label className="input-labels">Check In &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      Check Out</label>
								<div className="field-icon-wrap check-wrap">
									<DateRangePicker
										startDate={this.state.date_in} // momentPropTypes.momentObj or null,
										startDateId="modify_start_date" // PropTypes.string.isRequired,
										endDate={this.state.date_out} // momentPropTypes.momentObj or null,
										endDateId="modify_end_date" // PropTypes.string.isRequired,
										onDatesChange={({ startDate, endDate }) =>
											this.setState(prevState => ({
												...prevState,
												date_in: startDate,
												date_out: endDate
											}
											))
										} // PropTypes.func.isRequired,
										focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
										onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
									/>
								</div>
							</div>
						</div>


						<div className="row">
							<div className="col-md-6 mb-3 mb-lg-0 col-lg-12">
								<label className="input-labels" style={{ color: 'darkgrey' }}>&nbsp;&nbsp;{this.state.transaction_dateIn.format('YYYY-MM-DD')} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      {this.state.transaction_dateOut.format('YYYY-MM-DD')}</label>
							</div>
						</div>

					</div>
				</div>
				<Button onClick={this.roomSearch}>Search</Button>


				{this.state.hotel.results!==undefined?<HotelInfoCard hotelData={this.state.hotel.results} collapseFlag={this.state.collapse} onCollapse={() => this.toggle} />:null}
				{roomPage}
				{checkOut}
			</div>
		);
	}
}

export default withRouter(ModifyRoomPage);

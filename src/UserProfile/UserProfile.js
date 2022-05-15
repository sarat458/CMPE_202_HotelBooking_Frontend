import React from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import "./UserProfile.css";
import homeImage from './homeImage7.jpg';
import ProfileEditName from './ProfileEditName'
import ProfileEditPassword from './ProfileEditPassword'
import { BACKEND_URL } from '../Configuration/config';

import {
	Card, CardText,
	Button, CardHeader,
	Container, Row, Col
} from 'reactstrap';
import { parse } from 'dotenv';

var topSectionStyle = {
	width: "100%",
	height: "100vh",
	backgroundRepeat: "no-repeat",
	backgroundSize: "cover",
	backgroundPosition: "center center",
	backgroundImage: `url(${homeImage})`,

};

class UserProfile extends React.Component {
	
	state = {
		name: "",
		email: "",
		reward: 0,
		currentDates: "",
		futureDates: "",
		rewardsEarned: "",
		transaction: "",
		currentRewardsHistory: [],
		futureRewardsHistory: [],
		user: []

	}

	RewardHistory(event) {
		event.preventDefault()
		this.props.history.push('/RewardHistory')
	}

	change = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	onSubmit = (e) => {//able to se values once submitted
		e.preventDefault();
		this.props.onSubmit(this.state)//possibly delete this.state
		// console.log(this.state);
	};
	fileSelectedHandler = event => {
		// console.log(event.target.files[0]);
	}


	componentDidMount() {
		// const url = BACKEND_URL+"/profile"
		// // console.log(url);
		// const userDetails = {
		// 	userEmail:localStorage.getItem('accesstoken').email
		// }
		// axios.post(url,userDetails)
		// 	.then(res =>{
		// 		console.log(res.data);
		// 		this.setState({
		// 			name: res.data.name,
		// 			email: res.data.email,
		// 			reward: res.data.reward
		// 		})
		// 	})
		const userID = JSON.parse(localStorage.getItem("accesstoken")).id
		axios.get(BACKEND_URL+"/rewardPoints/"+userID)
			.then((res)=>{
				this.setState({
						name: res.data.firstName+" "+res.data.lastName,
						email: res.data.email,
						reward: res.data.rewardPoints
					})
			})

		
	}

	redirectToHome() {
		this.props.history.push('/')
	}

	refreshPage = (name) => {
		this.setState({name : name});
	}
	render() {
		const profilePage = (
			<div className="profile-form-container col-lg-12 dark-tint" >
				<div>
					<Container className="profile-form-card-container">
						<Row>
							<Col sm="12" md={{ size: 6, offset: 3 }}>
								<div className="profile-card">
									<div className="profile-center-title"> Hello {this.state.name}!! </div>
									<br />
									<div className="profile-card-body profile-inner-card">
										<Col>
											<Card>
												<CardHeader className="profile-inner-cardheader" tag="h4"> ABOUT </CardHeader>
												<div className="profile-inner-cardbody">
													<Row>
														<Col xs="6" sm="4">
															<br />
															<br />
															<img className="profile-human-pic" src="https://png.pngtree.com/svg/20160308/_user_profile_icon_1108089.png" alt="profile" width="115" />
														</Col>
														<Col>
															<CardText className="profile-text-row">
																<br />
																<b> Email: </b> {this.state.email}
																<br />
																<b> Name: </b> {this.state.name}
																<br />
																{/* <b> Password: </b> ******** */}
							         							</CardText>
														</Col>
													</Row>
													<Row>
														<Col xs="4"></Col>
														<Col xs="8">
															<ProfileEditName email={this.state.email} refresh={this.refreshPage} name={this.state.name}/>
															{/* <ProfileEditPassword email={this.state.email}/> */}
															<br />
														</Col>
													</Row>
												</div>
											</Card>
										</Col>
									</div>
									<div className="profile-card-body profile-inner-card">
										<Col>
											<Card>
												<CardHeader className="profile-inner-cardheader" tag="h4"> REWARDS </CardHeader>
												<div className="profile-inner-cardbody">
													<CardText>
														<br />
														Total Points: {this.state.reward.toFixed(0)}
														<br />
														<br />
														{/* <Button onClick={this.RewardHistory.bind(this)} color="info"> See my reward history  </Button> */}
														<br />
														<br />
													</CardText>
												</div>
											</Card>
										</Col>
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		)

		return (
			<div className="col-lg-12 profile-container col-auto" style={topSectionStyle}>
				{localStorage.accesstoken ? profilePage : this.redirectToHome()}
			</div>
		);
	}
}

export default withRouter(UserProfile);
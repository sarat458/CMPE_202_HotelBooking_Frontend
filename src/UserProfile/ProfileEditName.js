import React from 'react';
import {withRouter} from 'react-router-dom'

import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input
} from 'reactstrap'


import { changeName } from '../Utility/ReigstrationLoginFunction'

class ProfileEditName extends React.Component {
	constructor() {
		super();

		this.state={
			modal:false,
			fields: {
				firstName: '',
				lastName:''
			},
			errors: {
			}
		}

		this.toggle = this.toggle.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleUpdate(event) {
		let temp_fields = this.state.fields;
		temp_fields[event.target.name] = event.target.value;
		this.setState({ fields : temp_fields });
	}

	toggle() {
		this.setState({
			...this.state,
			modal: !this.state.modal
		})
	}	

	handleSubmit = (event) => {
		event.preventDefault()
		console.log("check");
		// if(this.nameChecker()) {
			const temp_fields = {
				firstname: this.state.fields.firstName,
				lastname:this.state.fields.lastName,
				email:this.props.email
			}
		
		changeName(temp_fields)
			.then(res => {
				
			})
			this.setState({
				modal:false
			})
			this.props.refresh(temp_fields.firstname+" "+temp_fields.lastname);

		// }
	}


	// nameChecker() {
	// 	let temp_fields = this.state.fields;
	//     let temp_errors = {};
	//     let formIsValid = true;

	//     if (temp_fields["name"] === '') {
	//       formIsValid = false;
	//       temp_errors["name"] = "*Field was empty";
	//     }
	//     this.setState({
	//       errors: temp_errors
	//     });
	//     return formIsValid;

	// }

	render() {
		return (
			<div>
        	<Button size="sm" color="info" onClick={this.toggle} className="profile-button" >Edit Name</Button>

			<Modal isOpen={this.state.modal} toggle={this.toggle} centered>
				<ModalHeader toggle={this.toggle}> Edit Your Name </ModalHeader>

			<ModalBody>
				<Form onSubmit={this.handleSubmit}>
					<FormGroup>
						<Label> First Name: </Label>

						<Input type="text" name="firstName" placeholder={this.state.firstName} value={this.state.fields.firstName} onChange={this.handleUpdate} required />
						<div className="text-warning">{this.state.errors.name}</div>


						<Label> Last Name: </Label>

						<Input type="text" name="lastName" placeholder={this.state.lastName} value={this.state.fields.lastName} onChange={this.handleUpdate} required />
						<div className="text-warning">{this.state.errors.name}</div>
					</FormGroup>
				</Form>
			</ModalBody>

			<ModalFooter>
				<Button color="primary" onClick={this.handleSubmit}> Save </Button>
				<Button color="secondary" onClick={this.toggle}> Cancel </Button>
			</ModalFooter>

			</Modal>
			</div>
		)
	}
}

export default withRouter(ProfileEditName);
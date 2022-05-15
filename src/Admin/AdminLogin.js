import React from 'react'
import { withRouter } from 'react-router-dom'

// import neccessary components
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input,
} from 'reactstrap'

import './Admin.css';

class Registration extends React.Component {
  constructor() {
    super();
    // initial modal state : false
    this.state = {
      modal: false,
      fields: {
        email: '',
        password: '',
      }
    };

    this.toggle = this.toggle.bind(this);
    this.updateFields = this.updateFields.bind(this);
    this.login = this.login.bind(this);
  }

  updateFields(event) {
    let temp_fields = this.state.fields;
    temp_fields[event.target.name] = event.target.value;
    this.setState({ fields: temp_fields });

  }

  // toggle modal
  toggle() {
    this.setState({
      ...this.state,
      modal: !this.state.modal
      // or this.setState((currentState) => {modal:!currentState.modal})
    });
  }

  // when clicking register
  login = (event) => {
    // console.log('Register clicked')
    event.preventDefault()
    // if (this.validate()) {
      const temp_fields = {
        email: this.state.fields.email,
        password: this.state.fields.password,
    //   }

      //Admin Login Axios call
    //   registerPost(temp_fields).then(response => {
    //     console.log(response);
    //     if (response === 200) {
    //       this.setState({email_duplicate_error : false}, () => this.pushtoCurrentURL())
    //     } else if (response === 400) {
    //       this.setState({email_duplicate_error : true}, () => this.pushtoCurrentURL())
    //     }else if(response==500){
    //       this.setState({errors:true},()=>this.pushtoCurrentURL())
    //     }
    //   })
    }
    localStorage.setItem("userType","admin");
    this.props.history.push("/admin")
    this.setState({
      modal:false
    })
  }

  pushtoCurrentURL() {
    const currentURL = this.props.location.pathname + this.props.location.search
    this.props.history.push(currentURL)
  }


  render() {

    return (
      <div>
        <Button className={this.props.location.pathname === "/" || this.props.location.pathname === "/Confirmation" || this.props.location.pathname === "/recoverage" || this.props.location.pathname === "/Accesscode" ? "navbar-register-button" : "navbar-register-button-black"} color="primary-outline" onClick={this.toggle}>Admin</Button>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Admin Login</ModalHeader>

          {/*Admin Login form */}
          <ModalBody>
            <Form onSubmit={this.register}>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" name="email" value={this.state.fields.email} onChange={this.updateFields} placeholder="admin@email.com" required/>

              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input id="PopoverFocus" type="password" name="password" value={this.state.fields.password} onChange={this.updateFields} placeholder="********" required/>
              </FormGroup>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={this.login}>Login</Button>
            <Button color="secondary" onClick={this.toggle}>Close</Button>
          </ModalFooter>

        </Modal>
      </div>
    );
  }
}

export default withRouter(Registration);
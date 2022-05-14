import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

// import neccessary components
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Row, Col,
  UncontrolledPopover, PopoverHeader, PopoverBody,
} from 'reactstrap'



export class AdminNav extends Component {
    
    constructor() {
        
      }
    
    
      


  render() {
    return (
        <div>
  
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Registration</ModalHeader>
  
            {/*registration form */}
            <ModalBody>
              <Form >
                <Row form>    
  
                  <Col md={6}>
                    <FormGroup>
                      <Label>First Name</Label>
                      <Input type="text" name="firstname"  placeholder="Albert" required/>
                      <div className="text-warning"></div>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Last Name</Label>
                      <Input type="text" name="lastname"  placeholder="Einstein" required />
                      <div className="text-warning"></div>
                    </FormGroup>
                  </Col>
                </Row>
                
      
              </Form>
            </ModalBody>
  
            <ModalFooter>
              <Button color="primary" >Register</Button>
              <Button color="secondary" >Close</Button>
            </ModalFooter>
  
          </Modal>
        </div>
      )
  }
}
    

export default withRouter(AdminNav)
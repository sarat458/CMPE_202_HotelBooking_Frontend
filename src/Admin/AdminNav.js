import React from 'react';
import { withRouter } from 'react-router-dom'
import Registration from '../Registration/Registration'
import { logoutClearSession, adminPost } from '../Utility/ReigstrationLoginFunction'
// import neccessary components
import {
  Form, FormGroup, Input
} from 'reactstrap'
import Admin from '../Admin/Admin';

class AdminNav extends React.Component {
  constructor(props) {
    super(props)
  }

  Logout(event) {
    logoutClearSession()
    event.preventDefault()
    localStorage.removeItem('accesstoken')
    this.setState({
      loginfields: {
        email: '',
        password: '',
      },
      emailerror: '',
      loginerror: ''
    })
    if (window.location.pathname === '/UserProfile' || window.location.pathname === '/Reservations')
      this.props.history.push('/')
    else
      this.pushtoCurrentURL()
  }

  render() {

    const LogoutForm = (
      <div>
        <form className="form-inline my-2 my-lg-0">
          <div className="col-auto pl-0 pr-0">
            <button className="btn btn-primary my-2 my-sm-0" onClick={this.Logout.bind(this)} type="submit">LOGOUT</button>
          </div>
        </form>
      </div>
    )

    function navbarChange(temp) {
      if (temp === "/admin") {
        return "sticky-top navbar navbar-pages fixed-top"
      }

    }

    return (
      <nav className={navbarChange(this.props.location.pathname)}>
        {/*<nav className="sticky-top navbar navbar-home navbar-dark bg-light fixed-top">*/}

        {/*LEFT SIDE*/}
        <div className="navbar-left form-inline my-2 my-lg-0" >
          <div className="col-auto pl-0 custom-row">
            <div>Avengers Group of Hotels</div>
          </div>

        </div>


        {/*RIGHT SIDE*/}
        <div className="navbar-right form-inline my-2 my-lg-0" >
          <LogoutForm/>
        </div>

      </nav>
    );
  }
}

export default withRouter(AdminNav);

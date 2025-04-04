import React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import { FaCog, FaSearch, FaUserCircle } from 'react-icons/fa'
import { FaBell, FaMoon } from 'react-icons/fa6'
import './style.css'

export const Header = () => {
    return (
        <Navbar bg="white" expand="lg" className="shadow-sm px-3">
          <Container fluid>
            {/* <Navbar.Brand href="#">Student Management</Navbar.Brand> */}
            <img className='img' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqbideBla6tTJg1W3n-z-GslQoS9POtTwikbfFlrhHDahhMay5umVkHwLgVU9yX28qAqY&usqp=CAU" alt="" />
            <div className="d-flex align-items-center gap-3">
              {/* <FaMoon className="icon" /> */}
              {/* <FaSearch className="icon" /> */}
              <FaBell className="icon" />
              <FaCog className="icon" />
              <FaUserCircle className="icon user-icon" />
            </div>
          </Container>
        </Navbar>
    )
}

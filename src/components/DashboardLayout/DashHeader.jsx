import React from 'react'
import { useState } from "react"
import { slide as Menu } from "react-burger-menu";

function DashHeader() {


  const [isOpen, setOpen] = useState(false)

const handleIsOpen = () => {
  setOpen(!isOpen)
}

const closeSideBar = () => {
  setOpen(false)
}
console.log(isOpen);


  var styles = {
 

    bmCross: {
      background: '#ff5733'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
      width:'70%',
      top:'0',
      overflow:'scroll'
    },
    bmMenu: {
      background: '#ffffff',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)',
      height:'0px'
    }
  }

  return (
    <>
        <div className="main-wrapper">
        <div className="header">
      <div className="header-left">
        <a href="dashboard.html" className="logo">
          <img src="assets/img/logo.png" width={40} height={40} alt="" />
        </a>
      </div>
      {/* <a id="toggle_btn" href="">
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </a> */}
      <div className="page-title-box">
        <h3>Infinanze</h3>
      </div>
      <a id="mobile_btn" className="mobile_btn">
        {/* <i className="fa fa-bars" /> */}
        <Menu
    isOpen={isOpen}
    onOpen={handleIsOpen}
    onClose={handleIsOpen}
   styles={ styles }
   disableAutoFocus
    overlayClassName={'menu-overlay'}
   right 
   customBurgerIcon={<i className="fa fa-bars" /> } burgerButtonClassName={ "menu-icon" }
   itemListClassName={ "menuList" }
    >
 <ul onClick={closeSideBar}>
   <li className='nav-link'><a >About Us</a></li>
   <li className='nav-link'><a >Sign In</a></li>
   <li className='nav-link'><a >Sign Up</a></li>
   <li className='nav-link'><a >Sell</a></li>
   <li className='nav-link'><a >Contact Us</a></li>



   </ul>
</Menu>
      </a>
      <ul className="nav user-menu">
        
       
        <li className="nav-item dropdown">
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
          >
            <i className="fa fa-bell-o" />
            <span className="badge rounded-pill">3</span>
          </a>
         
        </li>
        <li className="nav-item dropdown">
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
          >
            <i className="fa fa-comment-o" />
            <span className="badge rounded-pill">8</span>
          </a>
         
        </li>
        <li className="nav-item dropdown has-arrow main-drop">
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-bs-toggle="dropdown"
          >
            <span className="user-img">
              <img src="assets/img/profiles/avatar-21.jpg" alt="" />
              <span className="status online" />
            </span>
            <span>Admin</span>
          </a>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="">
              My Profile
            </a>
            <a className="dropdown-item" href="">
              Settings
            </a>
            <a className="dropdown-item" href="">
              Logout
            </a>
          </div>
        </li>
      </ul>
    </div>
        </div>
    </>
  )
}

export default DashHeader
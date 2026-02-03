import React, { useEffect } from 'react'
import { MdOutlineNotificationAdd } from "react-icons/md";
import { useState } from "react"
import { Avatar,  Dropdown, Menu ,Popconfirm} from 'antd';
import {FiLogOut } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { slide as MobileMenu } from "react-burger-menu";
import SidebarItemMenu from "./Sidebars/AdminSidebarItem"
import { signOut } from "next-auth/react"
import { PAGE_LOGIN,PROFILE_PAGE } from '@/config/page-routes'
import Link from 'next/link'
import Image from 'next/image';
import GetSingleEntity from '@/hooks/ReactQuery/GetSingleEntity';
import { URL_GET_USER_BY_ID,URL_GET_UNREAD_MESSAGES, URL_SHOW_EMPLOYEE } from '@/config/api-paths';
 import Echo from 'laravel-echo';
import socketio from "socket.io-client";
 import Pusher from 'pusher-js';
 import { getRequest } from "@/hooks/apiService";
 import _ from 'lodash'
import AuthInfo from '../auth-info/info';


function DashNavbar(props) {
  const [isOpen, setOpen] = useState(false)
  const [notiData, setNotiData] = useState('')
 
  let {session,UserPerm,get_roles} = props

  const handleIsOpen = () => {
    setOpen(!isOpen)
  }

  let jwt = props?.session?.jwt;
  const ProfileObjectData = GetSingleEntity({
    url: URL_SHOW_EMPLOYEE,
    jwt: jwt,
    id : props?.session?.user?.user_id,
  })

  let user_name = ProfileObjectData?.data?.data?.data?.username
  let imgUrl = `https://ui-avatars.com/api/?background=063554&color=fff&name=${user_name}`

  var styles = {
    bmCross: {
      background: '#ffffff',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
      width: '85%',
      maxWidth: '320px',
      top: '0',
      left: '0',
      overflow: 'hidden',
      zIndex: 1000
    },
    bmMenu: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #e8f0ff 100%)',
      padding: '2.5em 1.5em 0',
      fontSize: '14px',
      boxShadow: '0 8px 32px rgba(95, 99, 242, 0.15)',
      backdropFilter: 'blur(10px)'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.5)',
      height: '100%'
    }
  }

  const handlelogout = () => {
    console.log("Logout")
    signOut({callbackUrl: PAGE_LOGIN})
  }

  const AccountMenu = (
    <Menu className="modern-dropdown-menu">
      <Menu.Item key="1" className="dropdown-item-modern">
        <Link href={PROFILE_PAGE} className="dropdown-link-modern">
          <div className="dropdown-item-content">
                         <i className="fas fa-user-circle" style={{ marginRight: '8px', color: '#4D4D4D' }}></i>
            <span>Profile</span>
          </div>
          </Link>
      </Menu.Item>

      <Menu.Item key="3" className="dropdown-item-modern">
        <Popconfirm
      title="Are you sure to logout?"
      onConfirm={() => handlelogout()}
          okText="Yes"
          cancelText="No"
          placement="bottomRight"
    >
          <div className="dropdown-item-content logout-item">
            <FiLogOut className="mr-2" style={{ fontSize: 14, color: '#dc3545' }} />
            <span style={{ color: '#dc3545' }}>Logout</span>
          </div>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className="main-wrapper">
        <div className="header modern-header">
          <div className="header-left">
            <div className="logo-container">
              <div className="logo-icon">
                <i className="fas fa-cube"></i>
              </div>
              <h2 className="logo-text">
              LMS
                <span className="logo-subtitle">Suite</span>
            </h2>
            </div>
          </div>

          <div className="page-title-box">
            <div className="title-container">
              <h3 className="page-title">
                <i className="fas fa-chart-line title-icon"></i>
               Lending Management System
              </h3>
              <div className="title-underline"></div>
            </div>
          </div>

          <a id="mobile_btn" className="mobile_btn modern-mobile-btn">
            <MobileMenu
              isOpen={isOpen}
              onOpen={handleIsOpen}
              onClose={handleIsOpen}
              styles={styles}
              disableAutoFocus
              overlayClassName={'menu-overlay'}
              left
              customBurgerIcon={
                <div className="burger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              }
              burgerButtonClassName={"menu-icon"}
              itemListClassName={"menuList"}
              pageWrapId={"page-wrap"}
            >
              <span className="mobile-sidebar-menu">
                <SidebarItemMenu UserPerm={UserPerm} get_roles={get_roles} setOpen={setOpen} />
              </span>
            </MobileMenu>
          </a>

          <ul className="nav user-menu d-block d-md-none mobile-user-menu">
<li className="nav-item dropdown">
              <Dropdown overlay={AccountMenu} trigger={["click"]} placement="bottomRight">
                <a href="#" className="dropdown-toggle nav-link mobile-dropdown-toggle">
                  <div className="mobile-avatar">
                    <Avatar 
                      src={imgUrl} 
                      size={32}
                      style={{ 
                        backgroundColor: '#4D4D4D',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 8px rgba(95, 99, 242, 0.2)'
                      }}
                    />
                  </div>
  </a>
  </Dropdown>
</li>
</ul>

          <ul className="nav user-menu desktop-user-menu">
            <li className="nav-item dropdown has-arrow main-drop">
            <AuthInfo ProfileObjectData={ProfileObjectData}/>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .modern-header {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #e8f0ff 100%);
          box-shadow: 0 4px 20px rgba(95, 99, 242, 0.15);
          border-bottom: 1px solid rgba(95, 99, 242, 0.1);
          backdrop-filter: blur(10px);
          padding: 0 20px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #4D4D4D 0%, #4347D9 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(95, 99, 242, 0.2);
        }

        .logo-icon i {
          color: #fff;
          font-size: 18px;
        }

        .logo-text {
          color: #4D4D4D;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 1px 2px rgba(95, 99, 242, 0.1);
        }

        .logo-subtitle {
          font-size: 14px;
          font-weight: 400;
          color: #6c757d;
          margin-left: 4px;
        }

        .page-title-box {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .title-container {
          text-align: center;
        }

        .page-title {
          color: #4D4D4D;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          text-shadow: 0 1px 2px rgba(95, 99, 242, 0.1);
        }

        .title-icon {
          font-size: 16px;
          color: #4D4D4D;
          opacity: 0.8;
        }

        .title-underline {
          height: 2px;
          background: linear-gradient(90deg, transparent, #4D4D4D, transparent);
          margin-top: 4px;
          border-radius: 1px;
        }

        .modern-mobile-btn {
          display: none;
        }

        .burger-icon {
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          background: rgba(95, 99, 242, 0.1);
          transition: all 0.3s ease;
        }

        .burger-icon:hover {
          background: rgba(95, 99, 242, 0.2);
          transform: scale(1.05);
        }

        .burger-icon span {
          width: 20px;
          height: 2px;
          background: #4D4D4D;
          border-radius: 1px;
          transition: all 0.3s ease;
        }

        .mobile-user-menu {
          display: none;
        }

        .mobile-dropdown-toggle {
          padding: 8px;
          border-radius: 8px;
          background: rgba(95, 99, 242, 0.1);
          transition: all 0.3s ease;
        }

        .mobile-dropdown-toggle:hover {
          background: rgba(95, 99, 242, 0.2);
        }

        .mobile-avatar {
          display: flex;
          align-items: center;
        }

        .desktop-user-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .modern-dropdown-menu {
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
          padding: 8px 0;
        }

        .dropdown-item-modern {
          padding: 0;
          margin: 0;
        }

        .dropdown-item-modern:hover {
          background: rgba(95, 99, 242, 0.1);
        }

        .dropdown-link-modern {
          display: block;
          padding: 12px 16px;
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .dropdown-link-modern:hover {
          color: #4D4D4D;
          text-decoration: none;
        }

        .dropdown-item-content {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dropdown-item-content:hover {
          background: rgba(95, 99, 242, 0.1);
          border-radius: 8px;
        }

        .logout-item:hover {
          background: rgba(220, 53, 69, 0.1) !important;
        }

        @media (max-width: 768px) {
          .modern-header {
            padding: 0 15px;
            height: 60px;
          }

          .logo-text {
            font-size: 20px;
          }

          .logo-subtitle {
            font-size: 12px;
          }

          .page-title {
            font-size: 16px;
          }

          .title-icon {
            font-size: 14px;
          }

          .modern-mobile-btn {
            display: block;
          }

          .mobile-user-menu {
            display: flex;
          }

          .desktop-user-menu {
            display: none;
          }

          .page-title-box {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .modern-header {
            padding: 0 10px;
          }

          .logo-container {
            gap: 8px;
          }

          .logo-icon {
            width: 32px;
            height: 32px;
          }

          .logo-icon i {
            font-size: 14px;
          }

          .logo-text {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  )
}

export default DashNavbar
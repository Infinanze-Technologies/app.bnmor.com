// Core React
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";

// UI Components
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Skeleton } from 'antd';

// Icons
import { FiSettings } from "react-icons/fi";
import { AiOutlineCloseCircle, AiOutlineHome } from "react-icons/ai";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { PiUsersDuotone } from "react-icons/pi";

// Services
import { signOut } from 'next-auth/react';

// Utilities
import { PERMISSIONS, hasAnyOfPermissions, hasAllOfPermissions } from '@/utils/permissionUtils';

// Configuration
import {
  ANNOUNCEMENT_PAGE,
  AWARDS_PAGE,
  HOLIDAYS_PAGE,
  LEAVE_PAGE,
  PAGE_HOME,
  PAGE_LOGIN,
  PROFILE_PAGE,
  PROMOTION_PAGE,
  RESIGNATION_PAGE,
  TERMINATION_PAGE,
  TIMESHEET_PAGE,
  GET_EMP_SALARY,
  GET_EMPZ_PAYSLIP,
  VIEW_EMPLOYEE_PAGE,
} from "@/config/page-routes";

/**
 * =============================================================================
 * EMPLOYEE SIDEBAR COMPONENT
 * =============================================================================
 */

/**
 * EmpSidebar - Sidebar component for staff/employee users
 * 
 * Features:
 * - Employee-specific menu items
 * - Permission-based menu rendering
 * - Active state management
 * - Logout functionality
 */
export default function EmpSidebar(props) {
  const { setOpen, permissions, role } = props;
  
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  
  const [menu, setMenu] = useState(false);
  const [getTime, setGetTime] = useState(true);
  const router = useRouter();

  // =============================================================================
  // EFFECTS
  // =============================================================================
  
  useEffect(() => {
    setMenu(false);
  }, []);

  useEffect(() => {
    setTimeout(() => setGetTime(false), 3000);
  }, []);

  // =============================================================================
  // HELPER FUNCTIONS
  // =============================================================================
  
  const handleLogout = () => {
    
    signOut({ callbackUrl: PAGE_LOGIN });
  };

  const isActive = (path) => {
    return router.pathname === path;
  };

  const isSubmenuActive = (paths) => {
    return paths.some(path => router.pathname === path);
  };

  // =============================================================================
  // PERMISSION CHECKS
  // =============================================================================
  
  // Employee-specific permission checks
  const hasAwardPermission = hasAnyOfPermissions(permissions, PERMISSIONS.AWARD_READ);
  const hasResignationPermission = hasAnyOfPermissions(permissions, PERMISSIONS.RESIGNATION_READ);
  const hasPromotionPermission = hasAnyOfPermissions(permissions, PERMISSIONS.PROMOTION_READ);
  const hasTerminationPermission = hasAnyOfPermissions(permissions, PERMISSIONS.TERMINATION_READ);
  const hasAnnouncementPermission = hasAnyOfPermissions(permissions, PERMISSIONS.ANNOUNCEMENT_READ);
  const hasHolidayPermission = hasAnyOfPermissions(permissions, PERMISSIONS.HOLIDAY_READ);
  const hasPayrollPermission = hasAnyOfPermissions(permissions, PERMISSIONS.PAYROLL_READ);
  
  // Example: Check if user has ANY HR-related permissions
  const hasHRAccess = hasAnyOfPermissions(permissions, 
    PERMISSIONS.AWARD_READ, 
    PERMISSIONS.RESIGNATION_READ, 
    PERMISSIONS.PROMOTION_READ, 
    PERMISSIONS.TERMINATION_READ, 
    PERMISSIONS.ANNOUNCEMENT_READ, 
    PERMISSIONS.HOLIDAY_READ
  );
  
  // Example: Check if user has ALL payroll permissions
  const hasFullPayrollAccess = hasAllOfPermissions(permissions, 
    PERMISSIONS.PAYROLL_READ, 
    PERMISSIONS.PAYROLL_CREATE
  );

  // =============================================================================
  // LOADING STATE
  // =============================================================================
  
  if (typeof(permissions) === 'undefined') {
    return (
      <ProSidebar>
        <div className='close-icon d-lg-none'>
          <AiOutlineCloseCircle size={30} onClick={() => setOpen(false)} />
        </div>
        <Menu iconShape="square">
          <MenuItem><Skeleton active style={{ width: "100%" }} /></MenuItem>
          <MenuItem><Skeleton active style={{ width: "100%" }} /></MenuItem>
          <MenuItem><Skeleton active style={{ width: "100%" }} /></MenuItem>
          <MenuItem><Skeleton active style={{ width: "100%" }} /></MenuItem>
          <MenuItem><Skeleton active style={{ width: "100%" }} /></MenuItem>
        </Menu>
      </ProSidebar>
    );
  }

  // =============================================================================
  // RENDER
  // =============================================================================
  
  return (
    <ProSidebar>
      <div className='close-icon d-lg-none'>
        <AiOutlineCloseCircle size={30} onClick={() => setOpen(false)} />
      </div>

      <Menu iconShape="square">
        {/* =============================================================================
            OVERVIEW MENU ITEM
            ============================================================================= */}
        
        <MenuItem 
          icon={<AiOutlineHome size={20} />}
          className={`sidebar-menu-item ${isActive(PAGE_HOME) ? 'sidebar-menu-item-active' : ''}`}
        >
          <Link href={PAGE_HOME}>
            <span className='nav-item'>Overview</span>
          </Link>
        </MenuItem>

        {/* =============================================================================
            EMPLOYEE MENU ITEM
            ============================================================================= */}
        
        <MenuItem 
          icon={<PiUsersDuotone size={20} />}
          className={`sidebar-menu-item ${isActive(VIEW_EMPLOYEE_PAGE) ? 'sidebar-menu-item-active' : ''}`}
        >
          <Link href={VIEW_EMPLOYEE_PAGE}>
            <span className='nav-item'>Employee</span>
          </Link>
        </MenuItem>

        {/* =============================================================================
            HR SETUP SUBMENU
            ============================================================================= */}
        
        {hasHRAccess && (
          <SubMenu 
            title="HR Setup" 
            icon={<MdOutlineLibraryBooks size={20} />}
            className={`sidebar-submenu ${isSubmenuActive([AWARDS_PAGE, RESIGNATION_PAGE, TERMINATION_PAGE, HOLIDAYS_PAGE, PROMOTION_PAGE, TIMESHEET_PAGE, LEAVE_PAGE, ANNOUNCEMENT_PAGE]) ? 'sidebar-submenu-active' : ''}`}
            defaultOpen={isSubmenuActive([AWARDS_PAGE, RESIGNATION_PAGE, TERMINATION_PAGE, HOLIDAYS_PAGE, PROMOTION_PAGE, TIMESHEET_PAGE, LEAVE_PAGE, ANNOUNCEMENT_PAGE])}
          >
            {hasAwardPermission && (
              <MenuItem className={`sidebar-submenu-item ${isActive(AWARDS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
                <Link href={AWARDS_PAGE}>
                  <span className='nav-item-two'>Award</span>
                </Link>
              </MenuItem>
            )}

            {hasResignationPermission && (
              <MenuItem className={`sidebar-submenu-item ${isActive(RESIGNATION_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
                <Link href={RESIGNATION_PAGE}>
                  <span className='nav-item-two'>Resignation</span>
                </Link>
              </MenuItem>
            )}

            {hasTerminationPermission && (
              <MenuItem className={`sidebar-submenu-item ${isActive(TERMINATION_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
                <Link href={TERMINATION_PAGE}>
                  <span className='nav-item-two'>Termination</span>
                </Link>
              </MenuItem>
            )}

            {hasHolidayPermission && (
              <MenuItem className={`sidebar-submenu-item ${isActive(HOLIDAYS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
                <Link href={HOLIDAYS_PAGE}>
                  <span className='nav-item-two'>Holidays</span>
                </Link>
              </MenuItem>
            )}

            {hasPromotionPermission && (
              <MenuItem className={`sidebar-submenu-item ${isActive(PROMOTION_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
                <Link href={PROMOTION_PAGE}>
                  <span className='nav-item-two'>Promotion</span>
                </Link>
              </MenuItem>
            )}

            <MenuItem className={`sidebar-submenu-item ${isActive(TIMESHEET_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
              <Link href={TIMESHEET_PAGE}>
                <span className='nav-item-two'>Timesheet</span>
              </Link>
            </MenuItem>

            <MenuItem className={`sidebar-submenu-item ${isActive(LEAVE_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
              <Link href={LEAVE_PAGE}>
                <span className='nav-item-two'>Leave</span>
              </Link>
            </MenuItem>

            {hasAnnouncementPermission && (
              <MenuItem className={`sidebar-submenu-item ${isActive(ANNOUNCEMENT_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
                <Link href={ANNOUNCEMENT_PAGE}>
                  <span className='nav-item-two'>Announcement</span>
                </Link>
              </MenuItem>
            )}  
          </SubMenu>
        )}

        {/* =============================================================================
            PAYROLL SUBMENU
            ============================================================================= */}
        
        {hasPayrollPermission && (
          <SubMenu 
            title="Payroll" 
            icon={<MdOutlineLibraryBooks size={20} />}
            className={`sidebar-submenu ${isSubmenuActive([GET_EMP_SALARY, GET_EMPZ_PAYSLIP]) ? 'sidebar-submenu-active' : ''}`}
            defaultOpen={isSubmenuActive([GET_EMP_SALARY, GET_EMPZ_PAYSLIP])}
          >
            <MenuItem className={`sidebar-submenu-item ${isActive(GET_EMP_SALARY) ? 'sidebar-submenu-item-active' : ''}`}>
              <Link href={GET_EMP_SALARY}>
                <span className='nav-item-two'>Set Salary</span>
              </Link>
            </MenuItem>

            <MenuItem className={`sidebar-submenu-item ${isActive(GET_EMPZ_PAYSLIP) ? 'sidebar-submenu-item-active' : ''}`}>
              <Link href={GET_EMPZ_PAYSLIP}>
                <span className='nav-item-two'>Payslip</span>
              </Link>
            </MenuItem>    
          </SubMenu>
        )}

        {/* =============================================================================
            SETTINGS SUBMENU
            ============================================================================= */}
        
        <SubMenu 
          title="Settings" 
          icon={<FiSettings size={20} />}
          className={`sidebar-submenu ${isSubmenuActive([PROFILE_PAGE]) ? 'sidebar-submenu-active' : ''}`}
          defaultOpen={isSubmenuActive([PROFILE_PAGE])}
        >
          <MenuItem className={`sidebar-submenu-item ${isActive(PROFILE_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
            <Link href={PROFILE_PAGE}>
              <span className='nav-item-two'>Edit Profile</span>
            </Link>
          </MenuItem>

          <MenuItem className='sidebar-submenu-item sidebar-logout-item'>
            <Link onClick={handleLogout} href='#'>
              <span className='nav-item-two'>Logout</span>
            </Link>
          </MenuItem>
        </SubMenu>
      </Menu>
    </ProSidebar>
  );
}
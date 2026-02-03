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
import { FaUsers, FaMoneyCheckAlt } from 'react-icons/fa';
import { BsBank2 } from 'react-icons/bs';

// Services
import { signOut } from 'next-auth/react';

// Utilities
import { PERMISSIONS, hasAnyOfPermissions, hasAllOfPermissions } from '@/utils/permissionUtils';

// Configuration
import {
  ALL_EMPLOYEE_PAGE,
  ANNOUNCEMENT_PAGE,
  AWARDS_PAGE,
  BANK_ACCOUNT_BALANCE_PAGE,
  BANK_ACCOUNT_LIST_PAGE,
  BANK_ACCOUNT_TRANSFER_PAGE,
  BRANCH_PAGE,
  BUSINESS_PAGE,
  DEPOSIT_PAGE,
  EXPENSE_PAGE,
  GET_EMP_PAYSLIP,
  GET_STAFF_LIST,
  HOLIDAYS_PAGE,
  LEAVE_PAGE,
  PAGE_HOME,
  PAGE_LOGIN,
  PAYEE_PAGE,
  PAYER_PAGE,
  PROFILE_PAGE,
  PROMOTION_PAGE,
  RESIGNATION_PAGE,
  ROLES_PAGE,
  TERMINATION_PAGE,
  TIMESHEET_PAGE,
  BORROWERS_PAGE,
  BORROWER_GROUPS_PAGE,
  GUARANTORS_PAGE,
  LOANS_PAGE,
  LOAN_PRODUCTS_PAGE,
  LOAN_REPAYMENTS_PAGE,
  CHART_OF_ACCOUNTS_PAGE,
} from "@/config/page-routes";
// /dashboard/finance/payee
///dashboard/finance/payer
/**
 * =============================================================================
 * ADMIN SIDEBAR COMPONENT
 * =============================================================================
 */

/**
 * AdminSidebarItem - Sidebar component for admin/manager users
 * 
 * Features:
 * - Permission-based menu rendering
 * - Role-based access control
 * - Active state management
 * - Logout functionality
 */
export default function AdminSidebarItem(props) {
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
  
  // Single permission checks
  const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.USER_CREATE);
  const hasAwardPermission = hasAnyOfPermissions(permissions, PERMISSIONS.AWARD_CREATE);
  const hasResignationPermission = hasAnyOfPermissions(permissions, PERMISSIONS.RESIGNATION_CREATE);
  const hasPromotionPermission = hasAnyOfPermissions(permissions, PERMISSIONS.PROMOTION_CREATE);
  const hasTerminationPermission = hasAnyOfPermissions(permissions, PERMISSIONS.TERMINATION_CREATE);
  const hasAnnouncementPermission = hasAnyOfPermissions(permissions, PERMISSIONS.ANNOUNCEMENT_CREATE);
  const hasHolidayPermission = hasAnyOfPermissions(permissions, PERMISSIONS.HOLIDAY_CREATE);
  
  // Multiple permission checks - user needs ALL of these
  const hasPayrollPermission = hasAllOfPermissions(permissions, PERMISSIONS.PAYROLL_CREATE, PERMISSIONS.PAYROLL_READ);
  const hasSettingsPermission = hasAllOfPermissions(permissions, PERMISSIONS.SETTINGS_CREATE, PERMISSIONS.SETTINGS_READ);
  
  // Alternative: Check if user has ANY of multiple permissions
  // const hasPayrollPermission = hasAnyOfPermissions(permissions, PERMISSIONS.PAYROLL_CREATE, PERMISSIONS.PAYROLL_READ);

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
            MANAGE USERS SUBMENU
            ============================================================================= */}
        
        {hasUserCreatePermission && (
          <SubMenu 
            title="Manage Users" 
            icon={<PiUsersDuotone size={20} />}
            className={`sidebar-submenu ${isSubmenuActive([ALL_EMPLOYEE_PAGE, ROLES_PAGE]) ? 'sidebar-submenu-active' : ''}`}
            defaultOpen={isSubmenuActive([ALL_EMPLOYEE_PAGE, ROLES_PAGE])}
          >
            <MenuItem 
              className={`sidebar-submenu-item ${isActive(ALL_EMPLOYEE_PAGE) ? 'sidebar-submenu-item-active' : ''}`}
            >
              <Link href={ALL_EMPLOYEE_PAGE}>
                <span className='nav-item-two'>Staff</span>
              </Link>
            </MenuItem>

            <MenuItem 
              className={`sidebar-submenu-item ${isActive(ROLES_PAGE) ? 'sidebar-submenu-item-active' : ''}`}
            >
              <Link href={ROLES_PAGE}>
                <span className='nav-item-two'>Roles</span>
              </Link>
            </MenuItem>
          </SubMenu>
        )}

        {/* =============================================================================
            HR SETUP SUBMENU
            ============================================================================= */}
        
        {(hasAwardPermission || hasResignationPermission || hasPromotionPermission || 
          hasTerminationPermission || hasAnnouncementPermission || hasHolidayPermission) && (
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

            <MenuItem className={`sidebar-submenu-item ${isActive(LEAVE_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
              <Link href={LEAVE_PAGE}>
                <span className='nav-item-two'>Leave</span>
              </Link>
            </MenuItem>
          </SubMenu>
        )}

        {/* =============================================================================
            PAYROLL SUBMENU
            ============================================================================= */}
        
        {hasPayrollPermission && (
          <SubMenu 
            title="Payroll" 
            icon={<MdOutlineLibraryBooks size={20} />}
            className={`sidebar-submenu ${isSubmenuActive([GET_STAFF_LIST, GET_EMP_PAYSLIP]) ? 'sidebar-submenu-active' : ''}`}
            defaultOpen={isSubmenuActive([GET_STAFF_LIST, GET_EMP_PAYSLIP])}
          >
            <MenuItem className={`sidebar-submenu-item ${isActive(GET_STAFF_LIST) ? 'sidebar-submenu-item-active' : ''}`}>
              <Link href={GET_STAFF_LIST}>
                <span className='nav-item-two'>Set Salary</span>
              </Link>
            </MenuItem>

            <MenuItem className={`sidebar-submenu-item ${isActive(GET_EMP_PAYSLIP) ? 'sidebar-submenu-item-active' : ''}`}>
              <Link href={GET_EMP_PAYSLIP}>
                <span className='nav-item-two'>Payslip</span>
              </Link>
            </MenuItem>    
          </SubMenu>
        )}

        {/* =============================================================================
            BORROWER HUB SUBMENU
            ============================================================================= */}
        
        <SubMenu
          title="Borrower Hub"
          icon={<FaUsers size={20} />}
          className={`sidebar-submenu ${isSubmenuActive([BORROWERS_PAGE, BORROWER_GROUPS_PAGE, GUARANTORS_PAGE]) ? 'sidebar-submenu-active' : ''}`}
          defaultOpen={isSubmenuActive([BORROWERS_PAGE, BORROWER_GROUPS_PAGE, GUARANTORS_PAGE])}
        >
          <MenuItem className={`sidebar-submenu-item ${isActive(BORROWERS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
            <Link href={BORROWERS_PAGE}>
              <span className='nav-item-two'>Borrowers</span>
            </Link>
          </MenuItem>
          <MenuItem className={`sidebar-submenu-item ${isActive(GUARANTORS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
            <Link href={GUARANTORS_PAGE}>
              <span className='nav-item-two'>Guarantors</span>
            </Link>
          </MenuItem>
          <MenuItem className={`sidebar-submenu-item ${isActive(BORROWER_GROUPS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
            <Link href={BORROWER_GROUPS_PAGE}>
              <span className='nav-item-two'>Groups</span>
            </Link>
          </MenuItem>
        </SubMenu>

        {/* =============================================================================
            MANAGE LOANS SUBMENU
            ============================================================================= */}
        
        <SubMenu
          title="Manage Loans"
          icon={<FaMoneyCheckAlt size={20} />}
          className={`sidebar-submenu ${isSubmenuActive([LOANS_PAGE, LOAN_PRODUCTS_PAGE, LOAN_REPAYMENTS_PAGE]) ? 'sidebar-submenu-active' : ''}`}
          defaultOpen={isSubmenuActive([LOANS_PAGE, LOAN_PRODUCTS_PAGE, LOAN_REPAYMENTS_PAGE])}
        >
          <MenuItem className={`sidebar-submenu-item ${isActive(LOAN_PRODUCTS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
            <Link href={LOAN_PRODUCTS_PAGE}>
              <span className='nav-item-two'>Loan Product</span>
            </Link>
          </MenuItem>

          <MenuItem className={`sidebar-submenu-item ${isActive(LOANS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
            <Link href={LOANS_PAGE}>
              <span className='nav-item-two'>Loans</span>
            </Link>
          </MenuItem>
          
          <MenuItem className={`sidebar-submenu-item ${isActive(LOAN_REPAYMENTS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
            <Link href={LOAN_REPAYMENTS_PAGE}>
              <span className='nav-item-two'>Loan Repayments</span>
            </Link>
          </MenuItem>
        </SubMenu>

        {/* =============================================================================
            ACCOUNTING SUBMENU
            ============================================================================= */}
        
        <SubMenu
          title="Accounting"
          icon={<BsBank2 size={20} />}
          className={`sidebar-submenu ${isSubmenuActive([CHART_OF_ACCOUNTS_PAGE]) ? 'sidebar-submenu-active' : ''}`}
          defaultOpen={isSubmenuActive([CHART_OF_ACCOUNTS_PAGE])}
        >
          <MenuItem className={`sidebar-submenu-item ${isActive(CHART_OF_ACCOUNTS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
            <Link href={CHART_OF_ACCOUNTS_PAGE}>
              <span className='nav-item-two'>Chart of Accounts</span>
            </Link>
          </MenuItem>
        </SubMenu>

        {/* =============================================================================
            SETTINGS SUBMENU
            ============================================================================= */}
        
        <SubMenu 
          title="Settings" 
          icon={<FiSettings size={20} />}
          className={`sidebar-submenu ${isSubmenuActive([BUSINESS_PAGE, PROFILE_PAGE, BRANCH_PAGE]) ? 'sidebar-submenu-active' : ''}`}
          defaultOpen={isSubmenuActive([BUSINESS_PAGE, PROFILE_PAGE, BRANCH_PAGE])}
        >
          {hasSettingsPermission && (
            <>
              <MenuItem className={`sidebar-submenu-item ${isActive(BRANCH_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
                <Link href={BRANCH_PAGE}>
                  <span className='nav-item-two'>Categories</span>
                </Link>
              </MenuItem>

              <MenuItem className={`sidebar-submenu-item ${isActive(BUSINESS_PAGE) ? 'sidebar-submenu-item-active' : ''}`}>
                <Link href={BUSINESS_PAGE}>
                  <span className='nav-item-two'>Account Profile</span>
                </Link>
              </MenuItem>
            </>
          )}

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
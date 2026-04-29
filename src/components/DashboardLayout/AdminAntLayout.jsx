import React, { useState, useEffect } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  BankOutlined,
  DollarOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  HomeOutlined,
  BellOutlined,
  GlobalOutlined,
  UserAddOutlined,
  CalendarOutlined,
  LoginOutlined,
  BuildOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown, Button, Badge, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

// Import existing components
import AdminSidebarItem from './Sidebars/AdminSidebarItem';
import GetSingleEntity from '@/hooks/ReactQuery/GetSingleEntity';
import { URL_SHOW_EMPLOYEE } from '@/config/api-paths';
import { PAGE_LOGIN, PROFILE_PAGE } from '@/config/page-routes';

// Import permission utilities
import { PERMISSIONS, hasAnyOfPermissions, hasAllOfPermissions } from '@/utils/permissionUtils';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

/**
 * =============================================================================
 * ADMIN ANT DESIGN LAYOUT COMPONENT
 * =============================================================================
 */

/**
 * AdminAntLayout - Layout component specifically for Admin/Manager users
 * 
 * Features:
 * - Admin-specific menu items
 * - Full system management capabilities
 * - Advanced navigation for administrators
 * - Complete system access
 */
export default function AdminAntLayout({ 
  children, 
  permissions, 
  role_name, 
  role_status, 
  role_is_super,
  session 
}) {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const router = useRouter();

  // =============================================================================
  // RESPONSIVE HANDLING
  // =============================================================================
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
        localStorage.setItem('sidebar-collapsed', 'true');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // =============================================================================
  // SIDEBAR STATE PERSISTENCE
  // =============================================================================
  
  const handleCollapse = (value) => {
    setCollapsed(value);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(value));
  };

  // =============================================================================
  // ACTIVE MENU DETECTION
  // =============================================================================
  
  useEffect(() => {
    const pathname = router.pathname;
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Determine active menu item based on current route
    let activeKey = '';
    let parentKey = '';
    
    if (pathname.includes('/dashboard/home')) {
      activeKey = 'dashboard';
    } else if (pathname.includes('/man_staff')) {
      parentKey = 'user-management';
      if (pathname.includes('/all_employees')) {
        activeKey = 'all-staff';
      } else if (pathname.includes('/roles')) {
        activeKey = 'roles';
      }
    } else if (pathname.includes('/hr/')) {
      parentKey = 'hr-management';
      if (pathname.includes('/awards')) {
        activeKey = 'awards';
      } else if (pathname.includes('/resignation')) {
        activeKey = 'resignation';
      } else if (pathname.includes('/termination')) {
        activeKey = 'termination';
      } else if (pathname.includes('/holidays')) {
        activeKey = 'holidays';
      } else if (pathname.includes('/promotion')) {
        activeKey = 'promotion';
      } else if (pathname.includes('/leave')) {
        activeKey = 'leave';
      }
    } else if (pathname.includes('/payroll/')) {
      parentKey = 'payroll-system';
      if (pathname.includes('/staff')) {
        activeKey = 'set-salaries';
      } else if (pathname.includes('/payslip')) {
        activeKey = 'payslips';
      }
    } else if (pathname.includes('/borrower-management/')) {
      parentKey = 'borrower-management';
      if (pathname.includes('/borrowers')) {
        activeKey = 'borrowers';
      } else if (pathname.includes('/guarantors')) {
        activeKey = 'guarantors';
      } else if (pathname.includes('/borrower-groups')) {
        activeKey = 'borrower-groups';
      }
    } else if (pathname.includes('/loan-management/')) {
      parentKey = 'loan-management';
      if (pathname.includes('/loan-products')) {
        activeKey = 'loan-products';
      } else if (pathname.includes('/loans')) {
        activeKey = 'active-loans';
      } else if (pathname.includes('/loan-repayments')) {
        activeKey = 'loan-repayments';
      }
    } else if (pathname.includes('/accounting/') || pathname.includes('/finance/')) {
      parentKey = 'finance-accounting';
      if (pathname.includes('/chart-of-accounts')) {
        activeKey = 'chart-of-accounts';
      } else if (pathname.includes('/bank_account_list')) {
        activeKey = 'bank-accounts';
      } else if (pathname.includes('/bank_account_balance')) {
        activeKey = 'bank-account-balance';
      } else if (pathname.includes('/deposit')) {
        activeKey = 'deposits';
      } else if (pathname.includes('/expense')) {
        activeKey = 'expenses';
      }
      // else if (pathname.includes('/transfer_bank_account')) {
      //   activeKey = 'transfer-bank-account';
      // }
       else if (pathname.includes('/payee')) {
        activeKey = 'payees';
      } else if (pathname.includes('/payer')) {
        activeKey = 'payers';
      }
    } else if (pathname.includes('/man_visitors/')) {
      parentKey = 'visitor-management';
      if (pathname.includes('/entries')) {
        activeKey = 'visitor-entries';
      } else if (pathname.includes('/guests')) {
        activeKey = 'visitor-guests';
      } else if (pathname.includes('/appointments')) {
        activeKey = 'visitor-appointments';
      } else if (pathname.includes('/pre-registration')) {
        activeKey = 'visitor-pre-registration';
      } else if (pathname.includes('/hosts')) {
        activeKey = 'visitor-hosts';
      }else if (pathname.includes('/organizations')) {
        activeKey = 'visitor-organizations';
      }
    } else if (pathname.includes('/constructions/')) {
      parentKey = 'construction-management';
      if (pathname.includes('/categories')) {
        activeKey = 'construction-categories';
      } else if (pathname.includes('/properties')) {
        activeKey = 'construction-properties';
      }
    } else if (pathname.includes('/man_settings/')) {
      parentKey = 'system-settings';
      if (pathname.includes('/business')) {
        activeKey = 'business-profile';
      } else if (pathname.includes('/profile')) {
        activeKey = 'edit-profile';
      } else if (pathname.includes('/branch')) {
        activeKey = 'categories';
      }
    }
    
    setSelectedKeys(activeKey ? [activeKey] : []);
    setOpenKeys(parentKey ? [parentKey] : []);
  }, [router.pathname]);
  
  // =============================================================================
  // THEME AND STYLING
  // =============================================================================
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // =============================================================================
  // USER DATA
  // =============================================================================
  
  let jwt = session?.jwt;
  const ProfileObjectData = GetSingleEntity({
    url: URL_SHOW_EMPLOYEE,
    jwt: jwt,
    id: session?.user?.user_id,
  });

  let user_name = ProfileObjectData?.data?.data?.fullname;
  let imgUrl = `https://ui-avatars.com/api/?background=063554&color=fff&name=${user_name}`;

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
  
  // Multiple permission checks
  const hasPayrollPermission = hasAllOfPermissions(permissions, PERMISSIONS.PAYROLL_CREATE, PERMISSIONS.PAYROLL_READ);
  const hasSettingsPermission = hasAllOfPermissions(permissions, PERMISSIONS.SETTINGS_CREATE, PERMISSIONS.SETTINGS_READ);
  const hasFinancePermission = hasAllOfPermissions(permissions, PERMISSIONS.FINANCE_CREATE, PERMISSIONS.FINANCE_READ,PERMISSIONS.FINANCE_UPDATE,PERMISSIONS.FINANCE_DELETE);
  const hasVisitorPermission = hasAllOfPermissions(permissions, PERMISSIONS.VISITOR_CREATE, PERMISSIONS.VISITOR_READ,PERMISSIONS.VISITOR_UPDATE,PERMISSIONS.VISITOR_DELETE);
  const hasCategoryPermission = hasAnyOfPermissions(permissions, PERMISSIONS.USER_CREATE, PERMISSIONS.PAYROLL_CREATE,PERMISSIONS.FINANCE_CREATE);
  const hasConstructionPermission = hasAnyOfPermissions(permissions, PERMISSIONS.CONSTRUCTION_CREATE, PERMISSIONS.CONSTRUCTION_READ, PERMISSIONS.CONSTRUCTION_UPDATE, PERMISSIONS.CONSTRUCTION_DELETE);
  // =============================================================================
  // ADMIN-SPECIFIC MENU ITEMS (PERMISSION-BASED) 
  // =============================================================================

  // console.log('====================================');
  // console.log(hasCategoryPermission);
  // console.log(permissions);
  // console.log('====================================');
  
  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  // Generate admin menu items based on permissions
  const generateAdminMenuItems = () => {
    const baseItems = [
      getItem('Dashboard', 'dashboard', <HomeOutlined />),
    ];

    // User Management - only show if user has permission
    if (hasUserCreatePermission) {
      baseItems.push(
        getItem('User Management', 'user-management', <UsergroupAddOutlined />, [
          getItem('All Staff', 'all-staff'),
          getItem('Roles & Permissions', 'roles'),
        ])
      );
    }

    // HR Management - only show if user has any HR permissions
    if (hasAwardPermission || hasResignationPermission || hasPromotionPermission || 
        hasTerminationPermission || hasAnnouncementPermission || hasHolidayPermission) {
      const hrChildren = [];
      
      if (hasAwardPermission) hrChildren.push(getItem('Awards', 'awards'));
      if (hasResignationPermission) hrChildren.push(getItem('Resignation', 'resignation'));
      if (hasTerminationPermission) hrChildren.push(getItem('Termination', 'termination'));
      if (hasHolidayPermission) hrChildren.push(getItem('Holidays', 'holidays'));
      if (hasPromotionPermission) hrChildren.push(getItem('Promotion', 'promotion'));
      hrChildren.push(getItem('Leave', 'leave')); // Always show leave
      
      baseItems.push(
        getItem('HR Management', 'hr-management', <BookOutlined />, hrChildren)
      );
    }

    // Payroll System - only show if user has payroll permissions
    if (hasPayrollPermission) {
      baseItems.push(
        getItem('Payroll System', 'payroll-system', <DollarOutlined />, [
          getItem('Set Salaries', 'set-salaries'),
          getItem('Payslips', 'payslips'),
        ])
      );
    }

    // Borrower Management - always show (no specific permission check)
    baseItems.push(
      getItem('Borrower Management', 'borrower-management', <TeamOutlined />, [
        getItem('Borrowers', 'borrowers'),
        getItem('Guarantors', 'guarantors'),
        getItem('Borrower Groups', 'borrower-groups'),
      ])
    );

    // Loan Management - always show (no specific permission check)
    baseItems.push(
      getItem('Loan Management', 'loan-management', <BankOutlined />, [
        getItem('Loan Products', 'loan-products'),
        getItem('Loans', 'active-loans'),
        getItem('Loan Repayments', 'loan-repayments'),
      ])
    );

    // Finance & Accounting - always show (no specific permission check)
    if (hasFinancePermission) {
    baseItems.push(
      getItem('Finance & Accounting', 'finance-accounting', <PieChartOutlined />, [
        getItem('Chart of Accounts', 'chart-of-accounts'),
        getItem('Bank Accounts', 'bank-accounts'),
        getItem('Bank Account Balance', 'bank-account-balance'),
        // getItem('Bank Transfer', 'bank-transfer'),
        getItem('Deposits', 'deposits'),
        getItem('Expenses', 'expenses'),
        getItem('Payees', 'payees'),
          getItem('Payers', 'payers'),
        ])
      );
    }

    // Construction Management - always show (no specific permission check)
    if (hasConstructionPermission) {
    baseItems.push(
      getItem('BuildOps', 'construction-management', <BuildOutlined />, [
        getItem('Categories', 'construction-categories'),
        getItem('Entities', 'construction-entities'),
        getItem('Properties', 'construction-properties'),
      ])
    );
    }

    // Visitor Management - always show (no specific permission check)
    // if (hasVisitorPermission) {
    // baseItems.push(
    //   getItem('Visitor Management', 'visitor-management', <UserAddOutlined />, [
    //     getItem('Hosts', 'visitor-hosts'),
    //     getItem('Organizations', 'visitor-organizations'),
    //     getItem('Guests', 'visitor-guests'),
    //     getItem('Appointments', 'visitor-appointments'),    
    //     getItem('Entries', 'visitor-entries'),

    //     // getItem('Pre-registration', 'visitor-pre-registration'),
    //   ])
    // );
    // }
    // System Settings - always show
    const settingsChildren = [
      getItem('Account Profile', 'edit-profile'),
      getItem('Logout', 'logout', <LogoutOutlined />),
    ];

    if (hasSettingsPermission) {
      settingsChildren.unshift(
        getItem('Business Profile', 'business-profile'),
      );
    }
    if (hasCategoryPermission) {
      settingsChildren.unshift(
        getItem('Categories & Types', 'categories')
      );
    }

    baseItems.push(
      getItem('System Settings', 'system-settings', <SettingOutlined />, settingsChildren)
    );

    return baseItems;
  };

  const adminMenuItems = generateAdminMenuItems();

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  
  const handleLogout = () => {
    signOut({ callbackUrl: PAGE_LOGIN });
  };

  const handleMenuClick = ({ key }) => {
    // Handle admin-specific menu item clicks
    switch (key) {
      case 'dashboard':
        router.push('/dashboard/overview');
        break;
      case 'all-staff':
        router.push('/dashboard/man_staff/all_employees');
        break;
      case 'roles':
        router.push('/dashboard/man_staff/roles');
        break;
      case 'awards':
        router.push('/dashboard/hr/awards');
        break;
      case 'resignation':
        router.push('/dashboard/hr/resignation');
        break;
      case 'termination':
        router.push('/dashboard/hr/termination');
        break;
      case 'holidays':
        router.push('/dashboard/hr/holidays');
        break;
      case 'promotion':
        router.push('/dashboard/hr/promotion');
        break;
      case 'leave':
        router.push('/dashboard/hr/leave');
        break;
      case 'set-salaries':
        router.push('/dashboard/payroll/staff');
        break;
      case 'payslips':
        router.push('/dashboard/payroll/payslip');
        break;
      case 'borrowers':
        router.push('/dashboard/borrower-management/borrowers');
        break;
      case 'guarantors':
        router.push('/dashboard/borrower-management/guarantors');
        break;
      case 'borrower-groups':
        router.push('/dashboard/borrower-management/borrower-groups');
        break;
      case 'loan-products':
        router.push('/dashboard/loan-management/loan-products');
        break;
      case 'active-loans':
        router.push('/dashboard/loan-management/loans');
        break;
      case 'loan-repayments':
        router.push('/dashboard/loan-management/loan-repayments');
        break;
      case 'chart-of-accounts':
        router.push('/dashboard/accounting/chart-of-accounts');
        break;
      case 'bank-accounts':
        router.push('/dashboard/finance/bank_account_list');
        break;
      case 'bank-account-balance':
        router.push('/dashboard/finance/bank_account_balance');
        break;
      // case 'bank-transfer':
      //   router.push('/dashboard/finance/transfer_bank_account');
      //   break;
      case 'deposits':
        router.push('/dashboard/finance/deposit');
        break;
      case 'expenses':
        router.push('/dashboard/finance/expense');
        break;
      case 'payees':
        router.push('/dashboard/finance/payee');
        break;
      case 'payers':
        router.push('/dashboard/finance/payer');
        break;
      case 'construction-categories':
        router.push('/dashboard/constructions/categories');
        break;
      case 'construction-properties':
        router.push('/dashboard/constructions/properties');
        break;
      case 'construction-entities':
        router.push('/dashboard/constructions/entities');
        break;
      case 'visitor-entries':
        router.push('/dashboard/man_visitors/entries');
        break;
      case 'visitor-guests':
        router.push('/dashboard/man_visitors/guests');
        break;
      case 'visitor-appointments':
        router.push('/dashboard/man_visitors/appointments');
        break;
        case 'visitor-organizations':
        router.push('/dashboard/man_visitors/organizations');
        break;
      case 'visitor-pre-registration':
        router.push('/dashboard/man_visitors/pre-registration');
        break;
        case 'visitor-hosts':
        router.push('/dashboard/man_visitors/hosts');
        break;
      case 'business-profile':
        router.push('/dashboard/man_settings/business');
        break;
      case 'account-profile':
        router.push('/dashboard/man_settings/profile');
        break;
      case 'categories':
        router.push('/dashboard/man_settings/branch');
        break;
      case 'edit-profile':
        router.push('/dashboard/man_settings/profile');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  // =============================================================================
  // USER DROPDOWN MENU
  // =============================================================================
  
  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <Link href={PROFILE_PAGE}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '8px 12px',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f9ff';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
          >
            <UserOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontWeight: 500 }}>Admin Profile</span>
          </div>
        </Link>
      ),
    },
    {
      key: 'settings',
      label: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f9ff';
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
        >
          <SettingOutlined style={{ color: '#52c41a' }} />
          <span style={{ fontWeight: 500 }}>Settings</span>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '8px 12px',
            borderRadius: '6px',
            color: '#ff4d4f',
            transition: 'all 0.3s ease',
          }}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fff2f0';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <LogoutOutlined />
          <span style={{ fontWeight: 500 }}>Logout</span>
        </div>
      ),
    },
  ];

  // =============================================================================
  // BREADCRUMB ITEMS
  // =============================================================================
  
  const getBreadcrumbItems = () => {
    const pathSegments = router.pathname.split('/').filter(Boolean);
    const breadcrumbItems = [{ title: 'Admin Dashboard' }];
    
    pathSegments.forEach((segment, index) => {
      if (segment !== 'dashboard') {
        breadcrumbItems.push({
          title: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
        });
      }
    });
    
    return breadcrumbItems;
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  
  return (
    <>
      <style jsx global>{`
        .admin-menu .ant-menu-item {
          border-radius: 8px !important;
          margin: 4px 0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
        }
        
        .admin-menu .ant-menu-item:hover {
          background: transparent !important;
          transform: none !important;
        }
        
        .admin-menu .ant-menu-item-selected {
          background: transparent !important;
          color: #5F63F2 !important; // Primary blue text for active states
          font-weight: 600 !important;
          box-shadow: none !important;
        }
        
        .admin-menu .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: -24px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: #5F63F2; // Primary blue accent
          border-radius: 2px;
          box-shadow: 0 2px 8px rgba(95, 99, 242, 0.5);
        }
        
        .admin-menu .ant-menu-submenu-title {
          border-radius: 8px !important;
          margin: 4px 0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .admin-menu .ant-menu-submenu-title:hover {
          background: transparent !important;
          transform: none !important;
        }
        
        .admin-menu .ant-menu-submenu-open > .ant-menu-submenu-title {
          background: rgba(95, 99, 242, 0.1) !important;
          color: #5F63F2 !important;
        }
        
        .admin-menu .ant-menu-submenu-open > .ant-menu-submenu-title::after {
          transform: rotate(180deg) !important;
        }
        
        .admin-menu .ant-menu-submenu .ant-menu-item {
          margin-left: 16px !important;
          border-radius: 6px !important;
        }
        
        .admin-menu .ant-menu-submenu .ant-menu-item:hover {
          background: transparent !important;
          transform: none !important;
        }
        
        .admin-menu .ant-menu-submenu .ant-menu-item-selected {
          background: transparent !important;
          color: #5F63F2 !important; // Primary blue text for active submenu items
          font-weight: 600 !important;
          box-shadow: none !important;
        }
        
        .admin-menu .ant-menu-submenu .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: -28px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 16px;
          background: #5F63F2; // Primary blue accent
          border-radius: 2px;
          box-shadow: 0 2px 6px rgba(95, 99, 242, 0.4);
        }
        
        .admin-menu .ant-menu-item-icon {
          font-size: 16px !important;
          transition: all 0.3s ease !important;
        }
        
        .admin-menu .ant-menu-item-selected .ant-menu-item-icon {
          transform: scale(1.1) !important;
        }
        
        .admin-menu .ant-menu-submenu-arrow {
          transition: all 0.3s ease !important;
        }
        
        .admin-menu .ant-menu-submenu-open .ant-menu-submenu-arrow {
          transform: rotate(180deg) !important;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Custom scrollbar styling for sidebar */
        .admin-sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .admin-sidebar-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        
        .admin-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(95, 99, 242, 0.3);
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        
        .admin-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(95, 99, 242, 0.5);
        }
        
        /* Firefox scrollbar styling */
        .admin-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(95, 99, 242, 0.3) rgba(0, 0, 0, 0.05);
        }
      `}</style>
      <Layout style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e6f7ff 100%)',
      }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={handleCollapse}
        theme="dark"
        width={280}
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          background: '#F7F7F7', // Light gray background
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ 
          padding: collapsed ? '20px 16px' : '24px 20px', 
          textAlign: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          marginBottom: '8px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '12px',
            color: '#2c3e50',
            fontSize: collapsed ? '20px' : '18px',
            fontWeight: '700',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              background: 'rgba(95, 99, 242, 0.1)',
              borderRadius: '12px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img 
                src="/assets/logo.png" 
                alt="KLSM Logo" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  objectFit: 'contain'
                }} 
              />
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>KLSM Suite</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>Admin Dashboard</div>
              </div>
            )}
          </div>
        </div>
        
        <div 
          className="admin-sidebar-scroll"
          style={{
            height: 'calc(100vh - 120px)', // Subtract header height
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '4px',
          }}
        >
          <Menu
            theme="light"
            mode="inline"
            items={adminMenuItems}
            onClick={handleMenuClick}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0 8px',
              height: '100%',
            }}
            className="admin-menu"
          />
        </div>
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? (isMobile ? 0 : 80) : 280, transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <Header 
          style={{ 
            padding: isMobile ? '0 16px' : '0 32px', 
            background: 'linear-gradient(135deg, #F7F7F7 0%, #ffffff 100%)', // Light gradient header
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => handleCollapse(!collapsed)}
              style={{
                fontSize: '18px',
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'rgba(95, 99, 242, 0.1)',
                border: '1px solid rgba(95, 99, 242, 0.2)',
                color: '#5F63F2',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(95, 99, 242, 0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(95, 99, 242, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
            <div>
              <Title level={3} style={{ 
                margin: 0, 
                color: '#2c3e50',
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: '700',
                textShadow: 'none',
              }}>
              KLSM Dashboard
              </Title>
              <Text style={{ 
                fontSize: '12px', 
                color: '#6c757d',
                marginTop: '-4px',
                display: 'block'
              }}>
                Welcome back, {user_name || 'Admin'}
              </Text>
            </div>
          </div>
          
          <Space size="middle" style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={0} size="small" style={{ backgroundColor: '#5F63F2' }}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  fontSize: '18px',
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'rgba(95, 99, 242, 0.1)',
                  border: '1px solid rgba(95, 99, 242, 0.2)',
                  color: '#5F63F2',
                }}
              />
            </Badge>
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '16px',
                background: 'rgba(95, 99, 242, 0.1)',
                border: '1px solid rgba(95, 99, 242, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: isMobile ? 'auto' : '200px',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(95, 99, 242, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(95, 99, 242, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(95, 99, 242, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <Avatar 
                  src={imgUrl} 
                  size={36}
                  style={{ 
                    background: 'linear-gradient(135deg, #5F63F2 0%, #4347D9 100%)',
                    border: '3px solid rgba(95, 99, 242, 0.2)',
                    boxShadow: '0 4px 12px rgba(95, 99, 242, 0.2)'
                  }}
                />
                {!isMobile && (
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '14px',
                      color: '#2c3e50',
                      lineHeight: 1.2
                    }}>
                      {user_name || 'Admin'}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#6c757d',
                      lineHeight: 1.2
                    }}>
                      {role_name}
                    </div>
                  </div>
                )}
              </div>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: isMobile ? '0 8px' : '0 24px',
          padding: isMobile ? '16px 0' : '24px 0',
        }}>
          <Breadcrumb 
            style={{ 
              margin: isMobile ? '8px 0 16px 0' : '16px 0 24px 0',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }} 
            items={getBreadcrumbItems()} 
          />
          <div
            style={{
              padding: isMobile ? '16px' : '32px',
              minHeight: 'calc(100vh - 200px)',
              background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative background elements */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(82, 196, 26, 0.05) 100%)',
              borderRadius: '50%',
              zIndex: 0,
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, rgba(250, 173, 20, 0.05) 0%, rgba(255, 77, 79, 0.05) 100%)',
              borderRadius: '50%',
              zIndex: 0,
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </div>
          </div>
        </Content>
        
        <Footer style={{ 
          textAlign: 'center', 
          background: '#F7F7F7', // Light gray background to match sidebar
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          padding: isMobile ? '16px' : '24px',
          marginTop: 'auto',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}>
            <GlobalOutlined style={{ color: '#5F63F2', fontSize: '16px' }} />
            <Text style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#2c3e50',
            }}>
              KLSM Suite
            </Text>
          </div>
          <Text style={{ 
            fontSize: '12px', 
            color: '#6c757d',
            display: 'block',
          }}>
            ©{new Date().getFullYear()} Created by KLSM Team • All rights reserved
          </Text>
        </Footer>
      </Layout>
    </Layout>
    </>
  );
}

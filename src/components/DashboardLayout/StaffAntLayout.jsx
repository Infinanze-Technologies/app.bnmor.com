import React, { useState, useEffect } from 'react';
import {
  HomeOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BankOutlined,
  BellOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown, Button, Badge, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut } from 'next-auth/react';


import GetSingleEntity from '@/hooks/ReactQuery/GetSingleEntity';
import { URL_SHOW_EMPLOYEE } from '@/config/api-paths';
import { PAGE_LOGIN, PROFILE_PAGE } from '@/config/page-routes';

// Import permission utilities
import { PERMISSIONS, hasAnyOfPermissions, hasAllOfPermissions } from '@/utils/permissionUtils';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

/**
 * =============================================================================
 * STAFF ANT DESIGN LAYOUT COMPONENT
 * =============================================================================
 */

/**
 * StaffAntLayout - Layout component specifically for Staff users
 * 
 * Features:
 * - Staff-specific menu items
 * - Employee-focused navigation
 * - Simplified interface for staff users
 * - HR and payroll focused sections
 */
export default function StaffAntLayout({ 
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
    
    // Determine active menu item based on current route
    let activeKey = '';
    let parentKey = '';
    
    if (pathname.includes('/dashboard/home')) {
      activeKey = 'dashboard';
    } else if (pathname.includes('/man_settings/profile')) {
      activeKey = 'profile';
    } else if (pathname.includes('/hr/')) {
      parentKey = 'hr-services';
      if (pathname.includes('/awards')) {
        activeKey = 'awards';
      } else if (pathname.includes('/holidays')) {
        activeKey = 'holidays';
      } else if (pathname.includes('/leave')) {
        activeKey = 'leave';
      } else if (pathname.includes('/timesheet')) {
        activeKey = 'timesheet';
      } else if (pathname.includes('/resignation')) {
        activeKey = 'resignation';
      } else if (pathname.includes('/termination')) {
        activeKey = 'termination';
      } else if (pathname.includes('/promotion')) {
        activeKey = 'promotion';
      } else if (pathname.includes('/announcement')) {
        activeKey = 'announcement';
      }
    } else if (pathname.includes('/emp_payroll/')) {
      parentKey = 'payroll';
      if (pathname.includes('/set_salary')) {
        activeKey = 'my-salary';
      } else if (pathname.includes('/payslip')) {
        activeKey = 'payslips';
      }
    } else if (pathname.includes('/man_settings/')) {
      parentKey = 'settings';
      if (pathname.includes('/profile')) {
        activeKey = 'edit-profile';
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

  let user_name = ProfileObjectData?.data?.data?.data?.username;
  let imgUrl = `https://ui-avatars.com/api/?background=063554&color=fff&name=${user_name}`;

  // =============================================================================
  // PERMISSION CHECKS
  // =============================================================================
  
  // Employee-specific permission checks (using READ permissions for staff)
  const hasAwardPermission = hasAnyOfPermissions(permissions, PERMISSIONS.AWARD_READ);
  const hasResignationPermission = hasAnyOfPermissions(permissions, PERMISSIONS.RESIGNATION_READ);
  const hasPromotionPermission = hasAnyOfPermissions(permissions, PERMISSIONS.PROMOTION_READ);
  const hasTerminationPermission = hasAnyOfPermissions(permissions, PERMISSIONS.TERMINATION_READ);
  const hasAnnouncementPermission = hasAnyOfPermissions(permissions, PERMISSIONS.ANNOUNCEMENT_READ);
  const hasHolidayPermission = hasAnyOfPermissions(permissions, PERMISSIONS.HOLIDAY_READ);
  const hasPayrollPermission = hasAnyOfPermissions(permissions, PERMISSIONS.PAYROLL_READ);
  
  // Check if user has ANY HR-related permissions
  const hasHRAccess = hasAnyOfPermissions(permissions, 
    PERMISSIONS.AWARD_READ, 
    PERMISSIONS.RESIGNATION_READ, 
    PERMISSIONS.PROMOTION_READ, 
    PERMISSIONS.TERMINATION_READ, 
    PERMISSIONS.ANNOUNCEMENT_READ, 
    PERMISSIONS.HOLIDAY_READ
  );

  // =============================================================================
  // STAFF-SPECIFIC MENU ITEMS (PERMISSION-BASED)
  // =============================================================================
  
  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  // Generate staff menu items based on permissions
  const generateStaffMenuItems = () => {
    const baseItems = [
      getItem('Dashboard', 'dashboard', <HomeOutlined />),
      getItem('My Profile', 'profile', <UserOutlined />),
    ];

    // HR Services - only show if user has any HR permissions
    if (hasHRAccess) {
      const hrChildren = [];
      
      if (hasAwardPermission) hrChildren.push(getItem('Awards', 'awards'));
      if (hasHolidayPermission) hrChildren.push(getItem('Holidays', 'holidays'));
      hrChildren.push(getItem('Leave Request', 'leave')); // Always show leave
      hrChildren.push(getItem('Timesheet', 'timesheet')); // Always show timesheet
      
      if (hasResignationPermission) hrChildren.push(getItem('Resignation', 'resignation'));
      if (hasTerminationPermission) hrChildren.push(getItem('Termination', 'termination'));
      if (hasPromotionPermission) hrChildren.push(getItem('Promotion', 'promotion'));
      if (hasAnnouncementPermission) hrChildren.push(getItem('Announcement', 'announcement'));
      
      baseItems.push(
        getItem('HR Services', 'hr-services', <BookOutlined />, hrChildren)
      );
    }

    // Payroll - only show if user has payroll permissions
    if (hasPayrollPermission) {
      baseItems.push(
        getItem('Payroll', 'payroll', <DollarOutlined />, [
          getItem('My Salary', 'my-salary'),
          getItem('Payslips', 'payslips'),
        ])
      );
    }

    // Settings - always show
    baseItems.push(
      getItem('Settings', 'settings', <SettingOutlined />, [
        getItem('Edit Profile', 'edit-profile'),
        getItem('Change Password', 'change-password'),
        getItem('Logout', 'logout', <LogoutOutlined />),
      ])
    );

    return baseItems;
  };

  const staffMenuItems = generateStaffMenuItems();

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  
  const handleLogout = () => {
    signOut({ callbackUrl: PAGE_LOGIN });
  };

  const handleMenuClick = ({ key }) => {
    // Handle staff-specific menu item clicks
    switch (key) {
      case 'dashboard':
        router.push('/dashboard/home');
        break;
      case 'profile':
        router.push('/dashboard/man_settings/profile');
        break;
      case 'awards':
        router.push('/dashboard/hr/awards');
        break;
      case 'holidays':
        router.push('/dashboard/hr/holidays');
        break;
      case 'leave':
        router.push('/dashboard/hr/leave');
        break;
      case 'timesheet':
        router.push('/dashboard/hr/timesheet');
        break;
      case 'resignation':
        router.push('/dashboard/hr/resignation');
        break;
      case 'termination':
        router.push('/dashboard/hr/termination');
        break;
      case 'promotion':
        router.push('/dashboard/hr/promotion');
        break;
      case 'announcement':
        router.push('/dashboard/hr/announcement');
        break;
      case 'my-salary':
        router.push('/dashboard/emp_payroll/set_salary');
        break;
      case 'payslips':
        router.push('/dashboard/emp_payroll/payslip');
        break;
      case 'edit-profile':
        router.push('/dashboard/man_settings/profile');
        break;
      case 'change-password':
        // Add change password functionality
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
            <span style={{ fontWeight: 500 }}>My Profile</span>
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
    const breadcrumbItems = [{ title: 'Dashboard' }];
    
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
        .staff-menu .ant-menu-item {
          border-radius: 8px !important;
          margin: 4px 0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
        }
        
        .staff-menu .ant-menu-item:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateX(4px) !important;
        }
        
        .staff-menu .ant-menu-item-selected {
          background: transparent !important;
          color: #52c41a !important;
          font-weight: 600 !important;
          box-shadow: none !important;
        }
        
        .staff-menu .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: -24px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #52c41a 0%, #1890ff 100%);
          border-radius: 2px;
          box-shadow: 0 2px 8px rgba(82, 196, 26, 0.5);
        }
        
        .staff-menu .ant-menu-submenu-title {
          border-radius: 8px !important;
          margin: 4px 0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .staff-menu .ant-menu-submenu-title:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateX(4px) !important;
        }
        
        .staff-menu .ant-menu-submenu-open > .ant-menu-submenu-title {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
        
        .staff-menu .ant-menu-submenu-open > .ant-menu-submenu-title::after {
          transform: rotate(180deg) !important;
        }
        
        .staff-menu .ant-menu-submenu .ant-menu-item {
          margin-left: 16px !important;
          border-radius: 6px !important;
        }
        
        .staff-menu .ant-menu-submenu .ant-menu-item:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(2px) !important;
        }
        
        .staff-menu .ant-menu-submenu .ant-menu-item-selected {
          background: transparent !important;
          color: #52c41a !important;
          font-weight: 600 !important;
          box-shadow: none !important;
        }
        
        .staff-menu .ant-menu-submenu .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: -28px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 16px;
          background: linear-gradient(135deg, #52c41a 0%, #1890ff 100%);
          border-radius: 2px;
          box-shadow: 0 2px 6px rgba(82, 196, 26, 0.4);
        }
        
        .staff-menu .ant-menu-item-icon {
          font-size: 16px !important;
          transition: all 0.3s ease !important;
        }
        
        .staff-menu .ant-menu-item-selected .ant-menu-item-icon {
          transform: scale(1.1) !important;
        }
        
        .staff-menu .ant-menu-submenu-arrow {
          transition: all 0.3s ease !important;
        }
        
        .staff-menu .ant-menu-submenu-open .ant-menu-submenu-arrow {
          transform: rotate(180deg) !important;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
          background: 'linear-gradient(180deg, #28a745 0%, #20c997 50%, #28a745 100%)',
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
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '12px',
            color: 'white',
            fontSize: collapsed ? '20px' : '18px',
            fontWeight: '700',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <UserOutlined style={{ fontSize: '20px' }} />
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>Staff Portal</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>Employee Dashboard</div>
              </div>
            )}
          </div>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          items={staffMenuItems}
          onClick={handleMenuClick}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0 8px',
          }}
          className="staff-menu"
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? (isMobile ? 0 : 80) : 280, transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <Header 
          style={{ 
            padding: isMobile ? '0 16px' : '0 32px', 
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
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
                background: 'rgba(40, 167, 69, 0.1)',
                border: '1px solid rgba(40, 167, 69, 0.2)',
                color: '#28a745',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(40, 167, 69, 0.2)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(40, 167, 69, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
            <div>
              <Title level={3} style={{ 
                margin: 0, 
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: '700',
              }}>
                Staff Dashboard
              </Title>
              <Text style={{ 
                fontSize: '12px', 
                color: '#8c8c8c',
                marginTop: '-4px',
                display: 'block'
              }}>
                Welcome back, {user_name || 'Staff User'}
              </Text>
            </div>
          </div>
          
          <Space size="middle" style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={2} size="small" style={{ backgroundColor: '#ff4d4f' }}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  fontSize: '18px',
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'rgba(250, 173, 20, 0.1)',
                  border: '1px solid rgba(250, 173, 20, 0.2)',
                  color: '#faad14',
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
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                border: '1px solid rgba(40, 167, 69, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: isMobile ? 'auto' : '200px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <Avatar 
                  src={imgUrl} 
                  size={36}
                  style={{ 
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    border: '3px solid #fff',
                    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
                  }}
                />
                {!isMobile && (
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '14px',
                      color: '#28a745',
                      lineHeight: 1.2
                    }}>
                      {user_name || 'Staff User'}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#8c8c8c',
                      lineHeight: 1.2
                    }}>
                      Employee
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
              background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(32, 201, 151, 0.05) 100%)',
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
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
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
            <GlobalOutlined style={{ color: '#28a745', fontSize: '16px' }} />
            <Text style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#28a745',
            }}>
              Staff Portal
            </Text>
          </div>
          <Text style={{ 
            fontSize: '12px', 
            color: '#8c8c8c',
            display: 'block',
          }}>
            ©{new Date().getFullYear()} Created by Kilo ERP Team • All rights reserved
          </Text>
        </Footer>
      </Layout>
    </Layout>
    </>
  );
}

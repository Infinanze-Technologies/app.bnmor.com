// Core React
import React from 'react';
import dynamic from 'next/dynamic';

// UI Components
import { Skeleton } from 'antd';

// Dynamic Sidebar Components
const AdminSidebarItem = dynamic(
  () => import('./Sidebars/AdminSidebarItem'),
  { 
    loading: () => <div style={{padding: 24}}><Skeleton active /></div>, 
    ssr: false 
  }
);

const EmpSidebar = dynamic(
  () => import('./Sidebars/EmpSidebar'),
  { 
    loading: () => <div style={{padding: 24}}><Skeleton active /></div>, 
    ssr: false 
  }
);

/**
 * =============================================================================
 * DASHBOARD SIDEBAR COMPONENT
 * =============================================================================
 */

/**
 * DashSidebar - Main sidebar component that renders appropriate sidebar based on user role
 * 
 * Features:
 * - Role-based sidebar rendering
 * - Dynamic component loading
 * - Permission-based menu items
 */
function DashSidebar(props) {
  const { permissions, role_name } = props;

  // =============================================================================
  // SIDEBAR SELECTION LOGIC
  // =============================================================================
  
  const renderSidebar = () => {
    // Staff sidebar for staff users
    if (role_name === 'Staff') {
      return (
        <EmpSidebar 
          permissions={permissions} 
          role={role_name}
        />
      );
    }
    
    // Admin sidebar for all other users (managers, admins, etc.)
    return (
      <AdminSidebarItem 
        permissions={permissions} 
        role={role_name}
      />
    );
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  
  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        {renderSidebar()}
      </div>
    </div>
  );
}

export default DashSidebar;
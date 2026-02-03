import React from 'react';

// Import role-specific layout components
import StaffAntLayout from './StaffAntLayout';
import AdminAntLayout from './AdminAntLayout';

/**
 * =============================================================================
 * ANT DESIGN LAYOUT COMPONENT
 * =============================================================================
 */

/**
 * AntLayout - Main layout component that chooses between Staff and Admin layouts
 * 
 * Features:
 * - Role-based layout selection
 * - Staff-specific interface for staff users
 * - Admin-specific interface for admin/manager users
 * - Clean separation of concerns
 */
export default function AntLayout({ 
  children, 
  permissions, 
  role_name, 
  role_status, 
  role_is_super,
  session 
}) {
  // =============================================================================
  // ROLE-BASED LAYOUT SELECTION
  // =============================================================================
  // console.log('permissions', permissions);
  // console.log('role_name', role_name);
  // console.log('role_status', role_status);
  // console.log('role_is_super', role_is_super);
  // console.log('session', session);
  
  // Determine which layout to use based on user role
  if (role_name === 'Staff') {
    return (
      <StaffAntLayout
        permissions={permissions}
        role_name={role_name}
        role_status={role_status}
        role_is_super={role_is_super}
        session={session}
      >
        {children}
      </StaffAntLayout>
    );
  } else {
    // Admin, Manager, or any other role uses Admin layout
    return (
      <AdminAntLayout
        permissions={permissions}
        role_name={role_name}
        role_status={role_status}
        role_is_super={role_is_super}
        session={session}
      >
        {children}
      </AdminAntLayout>
    );
  }
}

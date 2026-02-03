import React from 'react';
import SecurityGuard from './SecurityGuard';
import { PERMISSIONS } from '../utils/permissionUtils';

/**
 * Example showing the simplified SecurityGuard usage
 * No need to manually fetch role permissions data - SecurityGuard handles it automatically
 */
const SimplifiedSecurityExample = ({ session }) => {
  return (
    <div className="container-fluid">
      <h2>Simplified SecurityGuard Usage</h2>
      
      {/* Simple usage - SecurityGuard automatically fetches role data */}
      <SecurityGuard
        requiredPermissions={[PERMISSIONS.USER_CREATE]}
        user={session?.user}
        jwt={session?.jwt}
        accessDeniedComponent={
          <div className="alert alert-danger">
            You need User.create permission to see this content
          </div>
        }
      >
        <ProtectedContent />
      </SecurityGuard>

      {/* Custom checker usage */}
      <SecurityGuard
        user={session?.user}
        jwt={session?.jwt}
        customChecker={(permissions, roleData) => {
          // Custom logic: Allow if user has any User permission OR is super admin
          const hasUserPermission = permissions.some(p => p.startsWith('User.'));
          const isSuperAdmin = roleData?.data?.is_super;
          return hasUserPermission || isSuperAdmin;
        }}
        accessDeniedComponent={
          <div className="alert alert-warning">
            You need User permissions or super admin access
          </div>
        }
      >
        <CustomProtectedContent />
      </SecurityGuard>
    </div>
  );
};

// Content components automatically receive role information
const ProtectedContent = ({ 
  role_name, 
  role_status, 
  role_is_super, 
  permissions 
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5>Protected Content</h5>
      </div>
      <div className="card-body">
        <p><strong>Role:</strong> {role_name}</p>
        <p><strong>Status:</strong> {role_status}</p>
        <p><strong>Super Admin:</strong> {role_is_super ? 'Yes' : 'No'}</p>
        <p><strong>Permissions:</strong> {permissions?.length || 0}</p>
      </div>
    </div>
  );
};

const CustomProtectedContent = ({ 
  role_name, 
  role_status, 
  role_is_super, 
  permissions 
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5>Custom Protected Content</h5>
      </div>
      <div className="card-body">
        <p>This content is shown based on custom permission logic</p>
        <p><strong>Role:</strong> {role_name}</p>
        <p><strong>Super Admin:</strong> {role_is_super ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default SimplifiedSecurityExample;

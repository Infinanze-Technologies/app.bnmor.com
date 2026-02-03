import React from 'react';
import SecurityGuard from './SecurityGuard';
import { PERMISSIONS } from '../utils/permissionUtils';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Example component showing how to access role information in your pages
 */
const RoleInfoExample = ({ roleWithPermissionsData }) => {
  // Using the usePermissions hook to get role information
  const { 
    role_name, 
    role_status, 
    role_is_super, 
    permissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete
  } = usePermissions(roleWithPermissionsData);

  return (
    <div className="container-fluid">
      <h2>Role Information Example</h2>
      
      {/* Role Information Display */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Role Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <strong>Role Name:</strong> {role_name}
            </div>
            <div className="col-md-4">
              <strong>Role Status:</strong> 
              <span className={`badge ${role_status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                {role_status}
              </span>
            </div>
            <div className="col-md-4">
              <strong>Is Super Admin:</strong> 
              <span className={`badge ${role_is_super ? 'badge-warning' : 'badge-secondary'}`}>
                {role_is_super ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Permission-based Content */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Permission-based Content</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <h6>User Permissions</h6>
              <ul className="list-unstyled">
                <li>{canCreate('User') ? '✅' : '❌'} Create Users</li>
                <li>{canRead('User') ? '✅' : '❌'} View Users</li>
                <li>{canUpdate('User') ? '✅' : '❌'} Edit Users</li>
                <li>{canDelete('User') ? '✅' : '❌'} Delete Users</li>
              </ul>
            </div>
            
            <div className="col-md-3">
              <h6>Role Permissions</h6>
              <ul className="list-unstyled">
                <li>{canCreate('Role') ? '✅' : '❌'} Create Roles</li>
                <li>{canRead('Role') ? '✅' : '❌'} View Roles</li>
                <li>{canUpdate('Role') ? '✅' : '❌'} Edit Roles</li>
                <li>{canDelete('Role') ? '✅' : '❌'} Delete Roles</li>
              </ul>
            </div>
            
            <div className="col-md-3">
              <h6>Finance Permissions</h6>
              <ul className="list-unstyled">
                <li>{canCreate('Finance') ? '✅' : '❌'} Create Finance</li>
                <li>{canRead('Finance') ? '✅' : '❌'} View Finance</li>
                <li>{canUpdate('Finance') ? '✅' : '❌'} Edit Finance</li>
                <li>{canDelete('Finance') ? '✅' : '❌'} Delete Finance</li>
              </ul>
            </div>
            
            <div className="col-md-3">
              <h6>Settings Permissions</h6>
              <ul className="list-unstyled">
                <li>{canCreate('Settings') ? '✅' : '❌'} Create Settings</li>
                <li>{canRead('Settings') ? '✅' : '❌'} View Settings</li>
                <li>{canUpdate('Settings') ? '✅' : '❌'} Edit Settings</li>
                <li>{canDelete('Settings') ? '✅' : '❌'} Delete Settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific Actions */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Role-specific Actions</h5>
        </div>
        <div className="card-body">
          {role_is_super && (
            <div className="alert alert-warning">
              <strong>Super Admin:</strong> You have full system access
            </div>
          )}
          
          {role_name === 'Admin' && (
            <div className="alert alert-info">
              <strong>Admin Role:</strong> You can manage users and system settings
            </div>
          )}
          
          {role_name === 'Manager' && (
            <div className="alert alert-primary">
              <strong>Manager Role:</strong> You can manage your department
            </div>
          )}
          
          {role_name === 'Staff' && (
            <div className="alert alert-secondary">
              <strong>Staff Role:</strong> You have limited access to your own data
            </div>
          )}
        </div>
      </div>

      {/* Conditional Buttons based on Role */}
      <div className="card">
        <div className="card-header">
          <h5>Conditional Actions</h5>
        </div>
        <div className="card-body">
          <div className="btn-group" role="group">
            {canCreate('User') && (
              <button className="btn btn-primary">Add User</button>
            )}
            
            {canRead('User') && (
              <button className="btn btn-info">View Users</button>
            )}
            
            {canUpdate('User') && (
              <button className="btn btn-warning">Edit Users</button>
            )}
            
            {canDelete('User') && (
              <button className="btn btn-danger">Delete Users</button>
            )}
            
            {role_is_super && (
              <button className="btn btn-dark">System Settings</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Example of how to use SecurityGuard with role information in a page
 */
const ExamplePage = ({ roleWithPermissionsData }) => {
  return (
    <SecurityGuard
      requiredPermissions={[PERMISSIONS.USER_READ]}
      roleWithPermissionsData={roleWithPermissionsData}
      accessDeniedComponent={
        <div className="alert alert-danger">
          You don't have permission to view this page
        </div>
      }
    >
      <RoleInfoExample roleWithPermissionsData={roleWithPermissionsData} />
    </SecurityGuard>
  );
};

export default RoleInfoExample;
export { ExamplePage };

import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Example component showing how to use role information in your components
 * This demonstrates how the Admin component (or any component) can access role information
 */
const RoleInfoUsageExample = ({ 
  roleWithPermissionsData,
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  // You can also use the usePermissions hook for additional functionality
  const { 
    canCreate, 
    canRead, 
    canUpdate, 
    canDelete,
    isAdmin 
  } = usePermissions(roleWithPermissionsData);

  return (
    <div className="container-fluid">
      {/* Role Information Display */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Role Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <strong>Role Name:</strong> {role_name}
                </div>
                <div className="col-md-3">
                  <strong>Status:</strong> 
                  <span className={`badge ${role_status === 'active' ? 'badge-success' : 'badge-danger'} ml-2`}>
                    {role_status}
                  </span>
                </div>
                <div className="col-md-3">
                  <strong>Super Admin:</strong> 
                  <span className={`badge ${role_is_super ? 'badge-warning' : 'badge-secondary'} ml-2`}>
                    {role_is_super ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="col-md-3">
                  <strong>Permissions:</strong> {permissions?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Content Based on Role */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Role-based Content</h5>
            </div>
            <div className="card-body">
              {/* Super Admin Content */}
              {role_is_super && (
                <div className="alert alert-warning">
                  <strong>Super Admin Access:</strong> You have full system access
                </div>
              )}

              {/* Role-specific Content */}
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

              {/* Permission-based Actions */}
              <div className="mt-3">
                <h6>Available Actions:</h6>
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
                  
                  {isAdmin('User') && (
                    <button className="btn btn-dark">User Admin Panel</button>
                  )}
                </div>
              </div>

              {/* Role Status-based Content */}
              {role_status === 'active' && (
                <div className="mt-3">
                  <div className="alert alert-success">
                    Your account is active and you have full access
                  </div>
                </div>
              )}

              {role_status === 'inactive' && (
                <div className="mt-3">
                  <div className="alert alert-danger">
                    Your account is inactive. Please contact administrator
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Debug Information (remove in production) */}
      <div className="row mt-3">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6>Debug Information</h6>
            </div>
            <div className="card-body">
              <pre className="bg-light p-3">
                {JSON.stringify({
                  role_name,
                  role_status,
                  role_is_super,
                  permissions: permissions?.slice(0, 5) // Show first 5 permissions
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoUsageExample;

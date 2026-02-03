import React from 'react';

/**
 * Example component showing how role information is automatically passed by SecurityGuard
 * No need to manually pass role information - it's automatically injected as props
 */
const AutoRoleInfoExample = ({ 
  // These props are automatically passed by SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions,
  roleWithPermissionsData,
  // Your regular props
  session,
  otherProps
}) => {
  return (
    <div className="container-fluid">
      <h2>Automatic Role Information Example</h2>
      
      {/* Role Information is automatically available */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Role Information (Automatically Passed)</h5>
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

      {/* Conditional content based on role */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Role-based Content</h5>
        </div>
        <div className="card-body">
          {role_is_super && (
            <div className="alert alert-warning">
              <strong>Super Admin:</strong> You have full system access
            </div>
          )}

          {role_name === 'Admin' && (
            <div className="alert alert-info">
              <strong>Admin Role:</strong> You can manage users and settings
            </div>
          )}

          {role_name === 'Manager' && (
            <div className="alert alert-primary">
              <strong>Manager Role:</strong> You can manage your department
            </div>
          )}

          {role_name === 'Staff' && (
            <div className="alert alert-secondary">
              <strong>Staff Role:</strong> You have limited access
            </div>
          )}

          {/* Permission-based content */}
          {permissions?.includes('User.create') && (
            <button className="btn btn-primary">Create User</button>
          )}
          
          {permissions?.includes('User.read') && (
            <button className="btn btn-info">View Users</button>
          )}
          
          {permissions?.includes('User.update') && (
            <button className="btn btn-warning">Edit Users</button>
          )}
          
          {permissions?.includes('User.delete') && (
            <button className="btn btn-danger">Delete Users</button>
          )}
        </div>
      </div>

      {/* Debug information */}
      <div className="card">
        <div className="card-header">
          <h6>Debug: Automatically Passed Props</h6>
        </div>
        <div className="card-body">
          <pre className="bg-light p-3">
            {JSON.stringify({
              role_name,
              role_status,
              role_is_super,
              permissionsCount: permissions?.length,
              hasUserCreate: permissions?.includes('User.create'),
              hasUserRead: permissions?.includes('User.read'),
              hasUserUpdate: permissions?.includes('User.update'),
              hasUserDelete: permissions?.includes('User.delete')
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AutoRoleInfoExample;

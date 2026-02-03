import React from 'react';
import SecurityGuard, { PermissionGate, withPermission } from './SecurityGuard';
import { PERMISSIONS, RESOURCES, ACTIONS } from '../utils/permissionUtils';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Example component demonstrating various ways to use the SecurityGuard component
 * This file serves as documentation and examples for implementing security
 */
const SecurityExamples = ({ roleWithPermissionsData }) => {
  const { 
    hasPermission, 
    canCreate, 
    canRead, 
    canUpdate, 
    canDelete,
    hasResourcePermission,
    isAdmin 
  } = usePermissions(roleWithPermissionsData);

  return (
    <div className="container-fluid">
      <h2>Security Component Examples</h2>
      
      {/* Example 1: Basic SecurityGuard with single permission */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Example 1: Basic SecurityGuard</h5>
        </div>
        <div className="card-body">
          <SecurityGuard
            requiredPermissions={[PERMISSIONS.USER_CREATE]}
            roleWithPermissionsData={roleWithPermissionsData}
            accessDeniedComponent={
              <div className="alert alert-warning">
                You need User.create permission to see this content
              </div>
            }
          >
            <div className="alert alert-success">
              ✅ You have User.create permission!
            </div>
          </SecurityGuard>
        </div>
      </div>

      {/* Example 2: SecurityGuard with multiple permissions (ALL required) */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Example 2: Multiple Permissions (ALL required)</h5>
        </div>
        <div className="card-body">
          <SecurityGuard
            requiredPermissions={[PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ]}
            roleWithPermissionsData={roleWithPermissionsData}
            mode="all"
            accessDeniedComponent={
              <div className="alert alert-warning">
                You need both User.create AND User.read permissions
              </div>
            }
          >
            <div className="alert alert-success">
              ✅ You have both User.create and User.read permissions!
            </div>
          </SecurityGuard>
        </div>
      </div>

      {/* Example 3: SecurityGuard with multiple permissions (ANY required) */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Example 3: Multiple Permissions (ANY required)</h5>
        </div>
        <div className="card-body">
          <SecurityGuard
            requiredPermissions={[PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ]}
            roleWithPermissionsData={roleWithPermissionsData}
            mode="any"
            accessDeniedComponent={
              <div className="alert alert-warning">
                You need either User.create OR User.read permission
              </div>
            }
          >
            <div className="alert alert-success">
              ✅ You have at least one of the required permissions!
            </div>
          </SecurityGuard>
        </div>
      </div>

      {/* Example 4: PermissionGate for conditional rendering */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Example 4: PermissionGate for Conditional Rendering</h5>
        </div>
        <div className="card-body">
          <PermissionGate
            permission={PERMISSIONS.USER_UPDATE}
            roleWithPermissionsData={roleWithPermissionsData}
            fallback={<div className="alert alert-info">Update button hidden - no permission</div>}
          >
            <button className="btn btn-primary">Edit User</button>
          </PermissionGate>

          <PermissionGate
            permission={PERMISSIONS.USER_DELETE}
            roleWithPermissionsData={roleWithPermissionsData}
            fallback={<div className="alert alert-info">Delete button hidden - no permission</div>}
          >
            <button className="btn btn-danger">Delete User</button>
          </PermissionGate>
        </div>
      </div>

      {/* Example 5: Using usePermissions hook */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Example 5: Using usePermissions Hook</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body text-center">
                  <h6>User Permissions</h6>
                  <div className="mb-2">
                    {canCreate(RESOURCES.USER) ? '✅' : '❌'} Create
                  </div>
                  <div className="mb-2">
                    {canRead(RESOURCES.USER) ? '✅' : '❌'} Read
                  </div>
                  <div className="mb-2">
                    {canUpdate(RESOURCES.USER) ? '✅' : '❌'} Update
                  </div>
                  <div className="mb-2">
                    {canDelete(RESOURCES.USER) ? '✅' : '❌'} Delete
                  </div>
                  <div className="mb-2">
                    {isAdmin(RESOURCES.USER) ? '👑' : '👤'} Admin
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card">
                <div className="card-body text-center">
                  <h6>Role Permissions</h6>
                  <div className="mb-2">
                    {canCreate(RESOURCES.ROLE) ? '✅' : '❌'} Create
                  </div>
                  <div className="mb-2">
                    {canRead(RESOURCES.ROLE) ? '✅' : '❌'} Read
                  </div>
                  <div className="mb-2">
                    {canUpdate(RESOURCES.ROLE) ? '✅' : '❌'} Update
                  </div>
                  <div className="mb-2">
                    {canDelete(RESOURCES.ROLE) ? '✅' : '❌'} Delete
                  </div>
                  <div className="mb-2">
                    {isAdmin(RESOURCES.ROLE) ? '👑' : '👤'} Admin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Example 6: Custom permission checker */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Example 6: Custom Permission Checker</h5>
        </div>
        <div className="card-body">
          <SecurityGuard
            roleWithPermissionsData={roleWithPermissionsData}
            customChecker={(permissions, roleData) => {
              // Custom logic: User must have either admin access to User resource
              // OR have both create and delete permissions
              const hasAdminAccess = isAdmin(RESOURCES.USER);
              const hasCreateAndDelete = canCreate(RESOURCES.USER) && canDelete(RESOURCES.USER);
              return hasAdminAccess || hasCreateAndDelete;
            }}
            accessDeniedComponent={
              <div className="alert alert-warning">
                Custom check failed: Need admin access OR both create and delete permissions
              </div>
            }
          >
            <div className="alert alert-success">
              ✅ Custom permission check passed!
            </div>
          </SecurityGuard>
        </div>
      </div>

      {/* Example 7: HOC with Permission */}
      <div className="card mb-3">
        <div className="card-header">
          <h5>Example 7: Higher-Order Component</h5>
        </div>
        <div className="card-body">
          <ProtectedComponent roleWithPermissionsData={roleWithPermissionsData} />
        </div>
      </div>
    </div>
  );
};

// Example component that will be protected by HOC
const ExampleComponent = ({ roleWithPermissionsData }) => (
  <div className="alert alert-success">
    This component is protected by HOC and requires User.create permission!
  </div>
);

// HOC example
const ProtectedComponent = withPermission(
  [PERMISSIONS.USER_CREATE],
  {
    accessDeniedComponent: (
      <div className="alert alert-danger">
        HOC: Access denied - User.create permission required
      </div>
    )
  }
)(ExampleComponent);

export default SecurityExamples;

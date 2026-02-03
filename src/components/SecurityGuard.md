# SecurityGuard Component Documentation

## Overview

The SecurityGuard component is a comprehensive security solution for handling permission-based access control in the ERP application. It uses the `RoleWithPermissionsDataObject` structure to validate user permissions and control access to different parts of the application.

## Features

- ✅ Permission-based access control
- ✅ Multiple permission checking modes (ALL/ANY)
- ✅ Custom permission checkers
- ✅ Loading states
- ✅ Customizable access denied components
- ✅ Higher-order components (HOC)
- ✅ Conditional rendering with PermissionGate
- ✅ Comprehensive utility functions
- ✅ Custom hooks for permission management

## Installation

The SecurityGuard component is already integrated into the project. No additional installation is required.

## Basic Usage

### 1. Simple Permission Check (Simplified)

```jsx
import SecurityGuard from '@/components/SecurityGuard';
import { PERMISSIONS } from '@/utils/permissionUtils';

// SecurityGuard automatically fetches role permissions data
<SecurityGuard
  requiredPermissions={[PERMISSIONS.USER_CREATE]}
  user={session?.user}
  jwt={session?.jwt}
>
  <YourComponent />
</SecurityGuard>
```

### 2. Accessing Role Information

The SecurityGuard component **automatically** passes role information to child components. No manual prop passing required:

```jsx
// Your component automatically receives role information as props
const YourComponent = ({ 
  role_name,        // Automatically passed by SecurityGuard
  role_status,       // Automatically passed by SecurityGuard
  role_is_super,     // Automatically passed by SecurityGuard
  permissions,       // Automatically passed by SecurityGuard
  roleWithPermissionsData // Automatically passed by SecurityGuard
}) => {
  return (
    <div>
      <h2>Welcome, {role_name}!</h2>
      <p>Status: {role_status}</p>
      <p>Super Admin: {role_is_super ? 'Yes' : 'No'}</p>
      <p>Permissions: {permissions?.length || 0}</p>
    </div>
  );
};
```

### 3. Multiple Permissions (ALL required)

```jsx
<SecurityGuard
  requiredPermissions={[PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ]}
  user={session?.user}
  jwt={session?.jwt}
  mode="all"
>
  <YourComponent />
</SecurityGuard>
```

### 4. Multiple Permissions (ANY required)

```jsx
<SecurityGuard
  requiredPermissions={[PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ]}
  user={session?.user}
  jwt={session?.jwt}
  mode="any"
>
  <YourComponent />
</SecurityGuard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to render if user has permissions |
| `requiredPermissions` | string[] | [] | Array of required permissions |
| `roleWithPermissionsData` | Object | - | Role with permissions data object |
| `fallbackComponent` | ReactNode | null | Component to render if access is denied |
| `showLoading` | boolean | true | Whether to show loading state |
| `loadingComponent` | ReactNode | `<LoadingCard />` | Loading component to display |
| `accessDeniedComponent` | ReactNode | Default alert | Component to show when access is denied |
| `mode` | 'all' \| 'any' | 'all' | Permission checking mode |
| `customChecker` | Function | null | Custom permission checker function |

## Advanced Usage

### Custom Permission Checker

```jsx
<SecurityGuard
  roleWithPermissionsData={RoleWithPermissionsDataObject}
  customChecker={(permissions, roleData) => {
    // Custom logic here
    return permissions.includes('User.create') && 
           permissions.includes('User.update');
  }}
>
  <YourComponent />
</SecurityGuard>
```

### PermissionGate for Conditional Rendering

```jsx
import { PermissionGate } from '@/components/SecurityGuard';

<PermissionGate
  permission={PERMISSIONS.USER_UPDATE}
  roleWithPermissionsData={RoleWithPermissionsDataObject}
  fallback={<div>No update permission</div>}
>
  <button>Edit User</button>
</PermissionGate>
```

### Higher-Order Component

```jsx
import { withPermission } from '@/components/SecurityGuard';

const ProtectedComponent = withPermission(
  [PERMISSIONS.USER_CREATE],
  {
    accessDeniedComponent: <div>Access denied</div>
  }
)(YourComponent);

// Usage
<ProtectedComponent roleWithPermissionsData={RoleWithPermissionsDataObject} />
```

## Utility Functions

### Permission Utils

```jsx
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  hasResourcePermission,
  hasResourceActionPermission,
  getPermissionsByResource,
  hasAdminPermission
} from '@/utils/permissionUtils';

// Check single permission
const canCreate = hasPermission(permissions, 'User.create');

// Check multiple permissions (ANY)
const canAccess = hasAnyPermission(permissions, ['User.create', 'User.read']);

// Check multiple permissions (ALL)
const canManage = hasAllPermissions(permissions, ['User.create', 'User.read', 'User.update']);

// Check resource permission
const canAccessUser = hasResourcePermission(permissions, 'User');

// Check specific action
const canCreateUser = hasResourceActionPermission(permissions, 'User', 'create');

// Check admin access
const isUserAdmin = hasAdminPermission(permissions, 'User');
```

### usePermissions Hook

```jsx
import { usePermissions } from '@/hooks/usePermissions';

const MyComponent = ({ roleWithPermissionsData }) => {
  const { 
    hasPermission, 
    canCreate, 
    canRead, 
    canUpdate, 
    canDelete,
    hasResourcePermission,
    isAdmin,
    // Role information
    role_name,
    role_status,
    role_is_super,
    permissions
  } = usePermissions(roleWithPermissionsData);

  return (
    <div>
      <h2>Welcome, {role_name}!</h2>
      <p>Status: {role_status}</p>
      {role_is_super && <p>You are a super admin!</p>}
      
      {canCreate('User') && <button>Create User</button>}
      {canRead('User') && <div>User List</div>}
      {canUpdate('User') && <button>Edit User</button>}
      {canDelete('User') && <button>Delete User</button>}
    </div>
  );
};
```

### Accessing Role Information in Pages

When using SecurityGuard, role information is automatically passed to child components:

```jsx
// In your page component
const MyPage = ({ roleWithPermissionsData }) => {
  return (
    <SecurityGuard
      requiredPermissions={[PERMISSIONS.USER_READ]}
      roleWithPermissionsData={roleWithPermissionsData}
    >
      <MyPageContent />
    </SecurityGuard>
  );
};

// Your content component receives role information as props
const MyPageContent = ({ 
  role_name, 
  role_status, 
  role_is_super, 
  permissions 
}) => {
  return (
    <div>
      <h1>Dashboard - {role_name}</h1>
      {role_is_super && (
        <div className="alert alert-warning">
          Super Admin Access
        </div>
      )}
    </div>
  );
};
```

## Permission Constants

All available permissions are defined in `PERMISSIONS` object:

```jsx
import { PERMISSIONS, RESOURCES, ACTIONS } from '@/utils/permissionUtils';

// Usage examples
PERMISSIONS.USER_CREATE    // 'User.create'
PERMISSIONS.USER_READ      // 'User.read'
PERMISSIONS.USER_UPDATE    // 'User.update'
PERMISSIONS.USER_DELETE    // 'User.delete'

RESOURCES.USER             // 'User'
RESOURCES.ROLE             // 'Role'
RESOURCES.AWARD            // 'Award'

ACTIONS.CREATE             // 'create'
ACTIONS.READ               // 'read'
ACTIONS.UPDATE             // 'update'
ACTIONS.DELETE             // 'delete'
```

## Real-world Examples

### 1. Page-level Protection

```jsx
// pages/dashboard/users/index.js
import SecurityGuard from '@/components/SecurityGuard';
import { PERMISSIONS } from '@/utils/permissionUtils';

export default function UsersPage(props) {
  const RoleWithPermissionsDataObject = GetSingleEntity({
    url: URL_SHOW_ROLE_WITH_PERMISSIONS_BY_ROLE_ID,
    id: props?.user?.role_id,
    jwt: props?.jwt
  });

  return (
    <AppLayout>
      <SecurityGuard
        requiredPermissions={[PERMISSIONS.USER_READ]}
        roleWithPermissionsData={RoleWithPermissionsDataObject}
        accessDeniedComponent={
          <div className="alert alert-danger">
            You don't have permission to view users
          </div>
        }
      >
        <UsersComponent />
      </SecurityGuard>
    </AppLayout>
  );
}
```

### 2. Component-level Protection

```jsx
const UserManagement = ({ 
  roleWithPermissionsData,
  role_name,
  role_status,
  role_is_super,
  permissions 
}) => {
  const { canCreate, canUpdate, canDelete } = usePermissions(roleWithPermissionsData);

  return (
    <div>
      <h2>User Management - {role_name}</h2>
      
      {role_is_super && (
        <div className="alert alert-warning">Super Admin Access</div>
      )}
      
      {canCreate('User') && (
        <button className="btn btn-primary">Add User</button>
      )}
      
      <UserList />
      
      {canUpdate('User') && (
        <button className="btn btn-warning">Edit Selected</button>
      )}
      
      {canDelete('User') && (
        <button className="btn btn-danger">Delete Selected</button>
      )}
    </div>
  );
};
```

### 3. Form Field Protection

```jsx
const UserForm = ({ roleWithPermissionsData }) => {
  const { canUpdate } = usePermissions(roleWithPermissionsData);

  return (
    <form>
      <input 
        type="text" 
        placeholder="Name" 
        disabled={!canUpdate('User')} 
      />
      
      <PermissionGate
        permission={PERMISSIONS.USER_UPDATE}
        roleWithPermissionsData={roleWithPermissionsData}
      >
        <input type="email" placeholder="Email" />
      </PermissionGate>
    </form>
  );
};
```

## Best Practices

1. **Use constants**: Always use `PERMISSIONS` constants instead of hardcoded strings
2. **Check permissions early**: Validate permissions at the page level
3. **Provide fallbacks**: Always provide meaningful fallback components
4. **Use hooks**: Use `usePermissions` hook for complex permission logic
5. **Test thoroughly**: Test all permission scenarios
6. **Document permissions**: Document which permissions are required for each feature

## Migration from Old System

If you're migrating from the old permission system:

### Before (Old System)
```jsx
{typeof(role_permz) != "undefined" && role_permz.includes("User.create") ? (
  <AdminComponent />
) : (
  <div className="alert alert-danger">Access denied</div>
)}
```

### After (New System)
```jsx
<SecurityGuard
  requiredPermissions={[PERMISSIONS.USER_CREATE]}
  roleWithPermissionsData={RoleWithPermissionsDataObject}
>
  <AdminComponent />
</SecurityGuard>
```

## Troubleshooting

### Common Issues

1. **Component not rendering**: Check if `roleWithPermissionsData` is properly passed
2. **Permissions not working**: Verify permission strings match exactly
3. **Loading state issues**: Check if `showLoading` prop is set correctly
4. **Custom checker not working**: Ensure the function returns a boolean

### Debug Tips

```jsx
// Add this to debug permissions
console.log('Permissions:', roleWithPermissionsData?.data?.permissions);
console.log('Required:', requiredPermissions);
console.log('Has permission:', hasPermission(permissions, 'User.create'));
```

## Support

For issues or questions regarding the SecurityGuard component, please refer to the examples in `SecurityExamples.jsx` or contact the development team.

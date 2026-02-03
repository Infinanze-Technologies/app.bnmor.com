import { useMemo } from 'react';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  getPermissionsByResource,
  hasResourcePermission,
  hasResourceActionPermission,
  getAvailableResources,
  hasAdminPermission
} from '../utils/permissionUtils';

/**
 * Custom hook for permission management
 * @param {Object} roleWithPermissionsData - The role with permissions data object
 * @returns {Object} - Permission utility functions and data
 */
export const usePermissions = (roleWithPermissionsData) => {
  const permissions = useMemo(() => {
    return roleWithPermissionsData?.data?.permissions || [];
  }, [roleWithPermissionsData]);

  const role_name = useMemo(() => {
    return roleWithPermissionsData?.data?.role_name || '';
  }, [roleWithPermissionsData]);

  const role_status = useMemo(() => {
    return roleWithPermissionsData?.data?.status || '';
  }, [roleWithPermissionsData]);

  const role_is_super = useMemo(() => {
    return roleWithPermissionsData?.data?.is_super || false;
  }, [roleWithPermissionsData]);

  const availableResources = useMemo(() => {
    return getAvailableResources(permissions);
  }, [permissions]);

  return {
    permissions,
    availableResources,
    role_name,
    role_status,
    role_is_super,
    
    // Permission checking functions
    hasPermission: (permission) => hasPermission(permissions, permission),
    hasAnyPermission: (requiredPermissions) => hasAnyPermission(permissions, requiredPermissions),
    hasAllPermissions: (requiredPermissions) => hasAllPermissions(permissions, requiredPermissions),
    
    // Resource-based permission checking
    getPermissionsByResource: (resource) => getPermissionsByResource(permissions, resource),
    hasResourcePermission: (resource) => hasResourcePermission(permissions, resource),
    hasResourceActionPermission: (resource, action) => hasResourceActionPermission(permissions, resource, action),
    hasAdminPermission: (resource) => hasAdminPermission(permissions, resource),
    
    // Utility functions
    getAvailableResources: () => availableResources,
    
    // Permission checking for common scenarios
    canCreate: (resource) => hasResourceActionPermission(permissions, resource, 'create'),
    canRead: (resource) => hasResourceActionPermission(permissions, resource, 'read'),
    canUpdate: (resource) => hasResourceActionPermission(permissions, resource, 'update'),
    canDelete: (resource) => hasResourceActionPermission(permissions, resource, 'delete'),
    
    // Check if user has any CRUD permission for a resource
    canAccess: (resource) => hasResourcePermission(permissions, resource),
    
    // Check if user has full admin access to a resource
    isAdmin: (resource) => hasAdminPermission(permissions, resource)
  };
};

export default usePermissions;

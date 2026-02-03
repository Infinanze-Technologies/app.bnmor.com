import React from 'react';
import LoadingCard from './LoadingCard';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissionUtils';;
import { URL_SHOW_ROLE_WITH_PERMISSIONS_BY_ROLE_ID } from '../config/api-paths';
import useGetSingleEntity from '@/hooks/useGetSingleEntity';
import jwt_decode from "jwt-decode"

/**
 * SecurityGuard Component
 * A comprehensive security component that handles permission-based access control
 * using RoleWithPermissionsDataObject structure
 */
const SecurityGuard = ({ 
  children, 
  requiredPermissions = [], 
  fallbackComponent = null,
  showLoading = true,
  loadingComponent = <LoadingCard />,
  accessDeniedComponent = (
    <div className="row mt-3 mb-2">
      <div className="col-12">
        <div className="alert alert-danger">
          <strong>Sorry !! You are not permitted to view this Page</strong>
        </div>
      </div>
    </div>
  ),
  // Permission checking mode: 'all' (default) or 'any'
  mode = 'all',
  // Custom permission checker function
  customChecker = null,
  // User session data for automatic fetching
  user,
  jwt
}) => {

    let user_decode = jwt_decode(jwt);


  // Fetch role permissions data if not provided
  const fetchedRoleData = useGetSingleEntity({
    url: URL_SHOW_ROLE_WITH_PERMISSIONS_BY_ROLE_ID,
    id: user_decode?.role_id,
    jwkToken: jwt
  });

  // Use provided data or fetched data
  const finalRoleData = fetchedRoleData?.data?.data;

  // Extract permissions from the role data object
  const permissions = finalRoleData?.permissions || [];
  const role_name = finalRoleData?.role_name || '';
  const role_status = finalRoleData?.status || '';
  const role_is_super = finalRoleData?.is_super || false;







  
  // Show loading state if data is not yet available
  if ((!finalRoleData || fetchedRoleData?.loading) && showLoading) {
    return loadingComponent;
  }

  // Use custom checker if provided
  if (customChecker && typeof customChecker === 'function') {
    const hasAccess = customChecker(permissions, finalRoleData);
    if (hasAccess) {
      // Clone children and inject role information as props
      const childrenWithRoleInfo = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            role_name,
            role_status,
            role_is_super,
            permissions,
            roleWithPermissionsData: finalRoleData
          });
        }
        return child;
      });
      
      return <>{childrenWithRoleInfo}</>;
    }
    return fallbackComponent ? <>{fallbackComponent}</> : <>{accessDeniedComponent}</>;

  }

  // Check permissions based on mode
  let hasRequiredPermissions = false;
  
  if (mode === 'any') {
    hasRequiredPermissions = hasAnyPermission(permissions, requiredPermissions);
  } else {
    hasRequiredPermissions = hasAllPermissions(permissions, requiredPermissions);
  }

  // If user has required permissions, render children with role information
  if (hasRequiredPermissions) {
    // Clone children and inject role information as props
    const childrenWithRoleInfo = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          role_name,
          role_status,
          role_is_super,
          permissions,
          roleWithPermissionsData: finalRoleData
        });
      }
      return child;
    });
    
    return <>{childrenWithRoleInfo}</>;
  }

  // If fallback component is provided, render it
  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Default access denied component
  return <>{accessDeniedComponent}</>;
};

/**
 * Higher-order component for permission-based access control
 * @param {Array} requiredPermissions - Array of required permissions
 * @param {Object} options - Configuration options
 * @returns {Function} - HOC function
 */
export const withPermission = (requiredPermissions, options = {}) => {
  return (WrappedComponent) => {
    return (props) => {
      return (
        <SecurityGuard
          requiredPermissions={requiredPermissions}
          roleWithPermissionsData={props.roleWithPermissionsData}
          
          {...options}
        >
          <WrappedComponent {...props} />
        </SecurityGuard>
      );
    };
  };
};

/**
 * Permission-based conditional rendering component
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} - Rendered component or null
 */
export const PermissionGate = ({ 
  permission, 
  permissions, 
  roleWithPermissionsData, 
  children, 
  fallback = null 
}) => {
  const userPermissions = permissions || roleWithPermissionsData?.data?.permissions || [];
  
  if (hasPermission(userPermissions, permission)) {
    return <>{children}</>;
  }
  
  return fallback ? <>{fallback}</> : null;
};

export default SecurityGuard;


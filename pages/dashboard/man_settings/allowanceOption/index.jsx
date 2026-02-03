// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import AllowanceOption from "@/modules/views/Admin/ManSettings/AllowanceOption/index"

// Hooks and Services
import { getSession } from 'next-auth/react'

// Configuration
import { PERMISSIONS, hasAnyOfPermissions } from "@/utils/permissionUtils"

/**
 * =============================================================================
 * COMPONENT DEFINITIONS
 * =============================================================================
 */

/**
 * Main layout component that includes sidebar and content
 * Receives role information from SecurityGuard
 */
const AllowanceOptionPageWithSidebar = ({ 
  props, 
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <AllowanceOptionPageContent 
      props={props}
      role_name={role_name}
      role_status={role_status}
      role_is_super={role_is_super}
      permissions={permissions}
    />
  );
};

/**
 * Wrapper component that receives role data from SecurityGuard and renders AppLayout
 */
const AllowanceOptionPageWithLayout = ({ 
  props, 
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <AppLayout
      session={props}
      permissions={permissions}
      role_name={role_name}
      role_status={role_status}
      role_is_super={role_is_super}
    >
      <PageTitle title="Allowance Option" />
      <AllowanceOptionPageWithSidebar 
        props={props}
        role_name={role_name}
        role_status={role_status}
        role_is_super={role_is_super}
        permissions={permissions}
      />
    </AppLayout>
  );
};

/**
 * Content component that shows the AllowanceOption component for users with User.create permission
 */
const AllowanceOptionPageContent = ({ 
  props, 
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.SETTINGS_READ);
 

  // Show admin/manager view for users with User.create permission
  if (hasUserCreatePermission) {
  return (
    <AllowanceOption 
      session={props} 
      permissions={permissions}
      role_name={role_name}
      role_status={role_status}
      role_is_super={role_is_super}
    />
    );
  }

  // Fallback - should not be reached due to SecurityGuard
  return (
    <div className="row mt-3 mb-2">
      <div className="col-12">
        <div className="alert alert-danger">
          <strong>Sorry !! You are not permitted to view this Page</strong>
        </div>
      </div>
    </div>
  );
};

/**
 * =============================================================================
 * MAIN PAGE COMPONENT
 * =============================================================================
 */

/**
 * AllowanceOptionPage - Allowance option management page
 * Handles security checks for User.create permission
 */
export default function AllowanceOptionPage(props) {
  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.SETTINGS_READ);
    
    // Allow access if user has create permission
    return hasUserCreatePermission;
  };

  // =============================================================================
  // ACCESS DENIED COMPONENT
  // =============================================================================
  
  const AccessDeniedComponent = (
    <div className="row mt-3 mb-2">
      <div className="col-12">
        <div className="alert alert-danger">
          <strong>Sorry !! You are not permitted to view this Page</strong>
        </div>
      </div>
    </div>
  );

  // =============================================================================
  // RENDER
  // =============================================================================
  
  return (
    <>
      {/* Show loading if no JWT token */}
      {typeof (props?.jwt) === "undefined" ? (
        <LoadingCard />
      ) : (
        <SecurityGuard
          user={props?.user}
          jwt={props?.jwt}
          customChecker={customPermissionChecker}
          showLoading={true}
          loadingComponent={<LoadingCard />}
          accessDeniedComponent={AccessDeniedComponent}
        >
          <AllowanceOptionPageWithLayout 
            props={props}
          />
        </SecurityGuard>
      )}
    </>
  );
}
export async function getServerSideProps({ req }) {
  const session = await getSession({ req })
  return { props: { ...session }}
}
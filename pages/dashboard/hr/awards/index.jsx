// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import Award from "@/modules/views/Admin/Hr/awards/index"
import EmpAward from "@/modules/views/Staffs/Hr/awards/index"

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
const AwardsPageWithSidebar = ({ 
  props, 
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <AwardsPageContent 
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
const AwardsPageWithLayout = ({ 
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
      <PageTitle title="Award Page" />
      <AwardsPageWithSidebar 
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
 * Content component that determines which view to show based on user permissions
 * - Admin view: Users with User.create permission
 * - Staff view: Users with role_name 'Staff'
 */
const AwardsPageContent = ({ 
  props, 
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  // Permission checks
  const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.AWARD_CREATE);
  const isStaff = role_name === 'Staff';

  // Show admin view for users with User.create permission
  if (hasUserCreatePermission) {
    return (
      <Award 
        session={props} 
        role_name={role_name}
        role_status={role_status}
        role_is_super={role_is_super}
        rolePermissions={permissions}
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
 * AwardsPage - Awards management page
 * Handles data fetching and security checks
 */
export default function AwardsPage(props) {
  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.AWARD_CREATE);
   
    
    // Allow access if user has create permission OR is staff OR is super user
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
          <AwardsPageWithLayout 
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
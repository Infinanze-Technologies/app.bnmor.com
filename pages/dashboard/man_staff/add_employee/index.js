// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import ContentNavbar from "@/components/DashboardLayout/DashNavbar"
import Sidebar from "@/components/DashboardLayout/DashSidebar"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import AddStaff from "@/modules/views/Admin/ManUser/Staff/conponents/AddStaff"

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
const AddEmployeePageWithSidebar = ({ 
  props, 
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <AddEmployeePageContent 
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
const AddEmployeePageWithLayout = ({ 
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
      <PageTitle title="Add Staff" />
      <AddEmployeePageWithSidebar 
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
 * Content component that shows the AddStaff component for users with User.create permission
 */
const AddEmployeePageContent = ({ 
  props, 
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <AddStaff 
      session={props} 
      permissions={permissions}
      role_name={role_name}
      role_status={role_status}
      role_is_super={role_is_super}
    />
  );
};

/**
 * =============================================================================
 * MAIN PAGE COMPONENT
 * =============================================================================
 */

/**
 * AddEmployeePage - Add new employee page
 * Handles security checks for User.create permission
 */
export default function AddEmployeePage(props) {
  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.USER_CREATE);
    const isSuperUser = roleData?.is_super || false;
    
    // Allow access if user has create permission OR is super user
    return hasUserCreatePermission || isSuperUser;
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
          <AddEmployeePageWithLayout 
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

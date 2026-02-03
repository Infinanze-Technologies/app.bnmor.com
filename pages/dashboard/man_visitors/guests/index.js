// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import Admin from "@/modules/views/Admin/ManVisitors/guests/index"

// Hooks and Services
import GetSingleEntity from "@/hooks/ReactQuery/GetSingleEntity"
import { getSession } from 'next-auth/react'

// Configuration
import { URL_SHOW_EMPLOYEE } from "@/config/api-paths"
import { PERMISSIONS, hasAnyOfPermissions, hasAllOfPermissions } from "@/utils/permissionUtils"

/**
 * =============================================================================
 * COMPONENT DEFINITIONS
 * =============================================================================
 */

/**
 * Main layout component that includes sidebar and content
 * Receives role information from SecurityGuard
 */
const AllVisitorsPageWithSidebar = ({ 
  props, 
  SingleEmployeeData,
  SingleEmployeeDocumentData,
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <AllVisitorsPageContent 
      props={props}
      SingleEmployeeData={SingleEmployeeData}
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
const AllVisitorsPageWithLayout = ({ 
  props, 
  SingleEmployeeData,
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
      <PageTitle title="Manage Visitors Guests" />
      <AllVisitorsPageWithSidebar 
        props={props}
        SingleEmployeeData={SingleEmployeeData}
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
 * - Admin/Manager view: Users with User.create permission
 * - Staff view: Users with role_name 'Staff'
 */ 
const AllVisitorsPageContent = ({ 
  props, 
  SingleEmployeeData,   
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  // Permission checks
  const hasVisitorCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.VISITOR_CREATE);
  const isStaff = role_name === 'Staff';

  // Show admin/manager view for users with User.create permission
  if (hasVisitorCreatePermission) {
    return (
      <Admin 
        session={props} 
        role_name={role_name}
        role_status={role_status}
        role_is_super={role_is_super}
        rolePermissions={permissions}
      />
    );
  }

  // Show staff view for users with role_name 'Staff'
  if (isStaff) {
    return (
      <div className="row mt-3 mb-2">
        <div className="col-12">
          <div className="alert alert-info">
            <strong>Staff View - Visitor Management</strong>
            <p>You can view your own employee information here.</p>
          </div>
        </div>
      </div>
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
 * AllEmployeesPage - Staff management page
 * Handles data fetching and security checks
 */
export default function AllVisitorsPage(props) {
  // =============================================================================
  // DATA FETCHING
  // =============================================================================
  
  // Fetch employee data for staff view
  const SingleEmployeeData = GetSingleEntity({
    url: URL_SHOW_EMPLOYEE,
    id: props?.user?.user_id,
    jwt: props?.jwt
  });


  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const hasVisitorCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.VISITOR_CREATE);
    return hasVisitorCreatePermission;
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
          <AllVisitorsPageWithLayout 
            props={props}
            SingleEmployeeData={SingleEmployeeData}
 
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

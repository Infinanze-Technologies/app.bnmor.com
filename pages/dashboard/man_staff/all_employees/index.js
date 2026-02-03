// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import Admin from "@/modules/views/Admin/ManUser/Staff/index"

// Hooks and Services
import GetSingleEntity from "@/hooks/ReactQuery/GetSingleEntity"
import { getSession } from 'next-auth/react'

// Configuration
import { URL_SHOW_EMPLOYEE, URL_GET_EMPLOYEE_DOCUMENT } from "@/config/api-paths"
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
const AllEmployeesPageWithSidebar = ({ 
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
    <AllEmployeesPageContent 
      props={props}
      SingleEmployeeData={SingleEmployeeData}
      SingleEmployeeDocumentData={SingleEmployeeDocumentData}
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
const AllEmployeesPageWithLayout = ({ 
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
    <AppLayout
      session={props}
      permissions={permissions}
      role_name={role_name}
      role_status={role_status}
      role_is_super={role_is_super}
    >
      <PageTitle title="Users Status" />
      <AllEmployeesPageWithSidebar 
        props={props}
        SingleEmployeeData={SingleEmployeeData}
        SingleEmployeeDocumentData={SingleEmployeeDocumentData}
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
const AllEmployeesPageContent = ({ 
  props, 
  SingleEmployeeData, 
  SingleEmployeeDocumentData,
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  // Permission checks
  const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.USER_CREATE);
  const isStaff = role_name === 'Staff';

  // Show admin/manager view for users with User.create permission
  if (hasUserCreatePermission) {
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
            <strong>Staff View - Employee Management</strong>
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
export default function AllEmployeesPage(props) {
  // =============================================================================
  // DATA FETCHING
  // =============================================================================
  
  // Fetch employee data for staff view
  const SingleEmployeeData = GetSingleEntity({
    url: URL_SHOW_EMPLOYEE,
    id: props?.user?.user_id,
    jwt: props?.jwt
  });

  // Fetch employee documents for staff view
  const SingleEmployeeDocumentData = GetSingleEntity({
    url: URL_GET_EMPLOYEE_DOCUMENT,
    id: props?.user?.user_id,
    jwt: props?.jwt
  });

  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.USER_CREATE);
   
    
    // Allow access if user has create OR read permissions OR is staff OR is super user
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
          <AllEmployeesPageWithLayout 
            props={props}
            SingleEmployeeData={SingleEmployeeData}
            SingleEmployeeDocumentData={SingleEmployeeDocumentData}
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

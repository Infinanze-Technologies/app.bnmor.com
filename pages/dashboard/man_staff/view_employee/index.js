// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import ContentNavbar from "@/components/DashboardLayout/DashNavbar"
import Sidebar from "@/components/DashboardLayout/DashSidebar"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import View from "@/modules/views/Staffs/Emp/conponents/index"

// Hooks and Services
import { getSession } from 'next-auth/react'
import { useRouter } from "next/router"
import GetSingleEntity from "@/hooks/ReactQuery/GetSingleEntity"

// Configuration
import { URL_GET_EMPLOYEE_DOCUMENT, URL_SHOW_EMPLOYEE } from "@/config/api-paths"
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
const ViewEmployeePageWithSidebar = ({ 
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
    <ViewEmployeePageContent 
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
const ViewEmployeePageWithLayout = ({ 
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
      <PageTitle title="View Employee" />
      <ViewEmployeePageWithSidebar 
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
 * Content component that shows the View component for Staff users
 */
const ViewEmployeePageContent = ({ 
  props, 
  SingleEmployeeData,
  SingleEmployeeDocumentData,
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <View 
      session={props} 
      SingleEmployeeData={SingleEmployeeData} 
      SingleEmployeeDocumentData={SingleEmployeeDocumentData} 
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
 * ViewEmployeePage - View employee page for staff
 * Handles data fetching and security checks for Staff role
 */
export default function ViewEmployeePage(props) {
  const router = useRouter();
  const { id } = router.query;

  // =============================================================================
  // DATA FETCHING
  // =============================================================================
  
  // Fetch employee data for current user
  const SingleEmployeeData = GetSingleEntity({
    url: URL_SHOW_EMPLOYEE,
    id: props?.user?.user_id,
    jwt: props?.jwt
  });

  // Fetch employee documents for current user
  const SingleEmployeeDocumentData = GetSingleEntity({
    url: URL_GET_EMPLOYEE_DOCUMENT,
    id: props?.user?.user_id,
    jwt: props?.jwt
  });

  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const isStaff = roleData?.role_name === 'Staff';
    const isSuperUser = roleData?.is_super || false;
    
    // Allow access if user is Staff OR is super user
    return isStaff || isSuperUser;
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
          <ViewEmployeePageWithLayout 
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

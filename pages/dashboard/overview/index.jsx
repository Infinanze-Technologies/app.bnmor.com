// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import AdminHome from "@/modules/views/Admin/Overview/loan/home"
// Hooks and Services
import GetSingleEntity from "@/hooks/ReactQuery/GetSingleEntity"
import { getSession } from 'next-auth/react'

// Configuration
import { URL_GET_EMPLOYEE_DOCUMENT, URL_SHOW_EMPLOYEE, URL_GET_BUSINESS_LOAN_SUMMARY } from "@/config/api-paths"
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
const HomePageWithSidebar = ({ 
  props, 
  SingleEmployeeData, 
  SingleEmployeeDocumentData, 
  BusinessLoanSummaryData,
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <HomePageContent 
      props={props}
      SingleEmployeeData={SingleEmployeeData}
      SingleEmployeeDocumentData={SingleEmployeeDocumentData}
      BusinessLoanSummaryData={BusinessLoanSummaryData}
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
const HomePageWithLayout = ({ 
  props, 
  SingleEmployeeData, 
  SingleEmployeeDocumentData, 
  BusinessLoanSummaryData,
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
      <PageTitle title="Overview Page" />
      <HomePageWithSidebar 
        props={props}
        SingleEmployeeData={SingleEmployeeData}
        SingleEmployeeDocumentData={SingleEmployeeDocumentData}
        BusinessLoanSummaryData={BusinessLoanSummaryData}
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
const HomePageContent = ({ 
  props, 
  SingleEmployeeData, 
  SingleEmployeeDocumentData, 
  BusinessLoanSummaryData,
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  // Permission checks
  const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.USER_CREATE);
  const isHR = role_name === 'HR';
  const isReceptionist = role_name === 'Receptionist';
  const isAdmin = role_name === 'Super Admin';
  // Show admin/manager view for users with User.create permission
  if (role_name !== 'Staff') {
    return (
      <AdminHome 
        session={props} 
        BusinessLoanSummaryData={BusinessLoanSummaryData}
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
 * HomePage - Main dashboard page component
 * Handles data fetching and security checks
 */
export default function HomePage(props) {
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

  // Fetch business loan summary for admin view
  const BusinessLoanSummaryData = GetSingleEntity({
    url: URL_GET_BUSINESS_LOAN_SUMMARY,
    jwt: props?.jwt
  });

  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.USER_CREATE);
    const hasVisitorCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.VISITOR_CREATE);
    const hasFinanceCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.FINANCE_CREATE);
    const isStaff = roleData?.role_name === 'Staff';
    // Allow access if user has admin permissions OR is NOT staff
    return hasUserCreatePermission || hasVisitorCreatePermission || hasFinanceCreatePermission || !isStaff;
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
          <HomePageWithLayout 
            props={props}
            SingleEmployeeData={SingleEmployeeData}
            SingleEmployeeDocumentData={SingleEmployeeDocumentData}
            BusinessLoanSummaryData={BusinessLoanSummaryData}
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
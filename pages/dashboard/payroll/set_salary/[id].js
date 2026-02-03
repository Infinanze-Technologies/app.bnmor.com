// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import SetSalary from "@/modules/views/Admin/Payroll/SetSalary/conponents/SetSalary"

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
const SetSalaryPageWithSidebar = ({ 
  props, 
  SingleEmployeeData,
  SingleEmployeeDocumentData,
  employeeId,
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <SetSalaryPageContent 
      props={props}
      SingleEmployeeData={SingleEmployeeData}
      SingleEmployeeDocumentData={SingleEmployeeDocumentData}
      employeeId={employeeId}
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
const SetSalaryPageWithLayout = ({ 
  props, 
  SingleEmployeeData,
  SingleEmployeeDocumentData,
  employeeId,
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
      <PageTitle title="Set Employee Salary" />
      <SetSalaryPageWithSidebar 
        props={props}
        SingleEmployeeData={SingleEmployeeData}
        SingleEmployeeDocumentData={SingleEmployeeDocumentData}
        employeeId={employeeId}
        role_name={role_name}
        role_status={role_status}
        role_is_super={role_is_super}
        permissions={permissions}
      />
    </AppLayout>
  );
};

/**
 * Content component that shows the SetSalary component for users with User.create permission
 */
const SetSalaryPageContent = ({ 
  props, 
  SingleEmployeeData,
  SingleEmployeeDocumentData,
  employeeId,
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  const hasFinanceCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.PAYROLL_CREATE);

  // Show admin/manager view for users with User.create permission
  if (hasFinanceCreatePermission) {    
    
  return (
    <SetSalary 
      session={props} 
      SingleEmployeeData={SingleEmployeeData} 
      SingleEmployeeDocumentData={SingleEmployeeDocumentData} 
      employee_id={employeeId} 
      permissions={permissions}
      role_name={role_name}
      role_status={role_status}
      role_is_super={role_is_super}
    />
  );
};



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
}

/**
 * =============================================================================
 * MAIN PAGE COMPONENT
 * =============================================================================
 */

/**
 * SetSalaryPage - Set salary page for specific employee
 * Handles data fetching and security checks for User.create permission
 */
export default function SetSalaryPage(props) {
  const router = useRouter();
  const { id } = router.query;

  // =============================================================================
  // DATA FETCHING
  // =============================================================================
  
  // Fetch employee data for specific employee
  const SingleEmployeeData = GetSingleEntity({
    url: URL_SHOW_EMPLOYEE,
    id: id,
    jwt: props?.jwt
  });

  // Fetch employee documents for specific employee
  const SingleEmployeeDocumentData = GetSingleEntity({
    url: URL_GET_EMPLOYEE_DOCUMENT,
    id: id,
    jwt: props?.jwt
  });

  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const hasFinanceCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.PAYROLL_CREATE);
    
    // Allow access if user has create permission OR has finance create permission
    return  hasFinanceCreatePermission;
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
          <SetSalaryPageWithLayout 
            props={props}
            SingleEmployeeData={SingleEmployeeData}
            SingleEmployeeDocumentData={SingleEmployeeDocumentData}
            employeeId={id}
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

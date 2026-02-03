// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import dynamic from 'next/dynamic';

// Hooks and Services
import { getSession } from 'next-auth/react'
import { useRouter } from "next/router"
import GetSingleEntity from '@/hooks/ReactQuery/GetSingleEntity';
import useGetEntity from '@/hooks/useGetEntity';

// Configuration
import { URL_GET_LOAN_REPAYMENTS_BY_LOAN_ID, URL_SHOW_LOAN, URL_GET_LOAN_SCHEDULE, URL_GET_LOAN_JOURNAL_ENTRIES,URL_GET_LOAN_AUDIT_TRAIL} from '@/config/api-paths';
import { PERMISSIONS, hasAnyOfPermissions } from "@/utils/permissionUtils"

// Dynamic import for ViewLoan component
const ViewLoan = dynamic(
  () => import('@/modules/views/Admin/ManLoan/Loans/conponents/View/ViewLoan'),
  { ssr: false, loading: () => <LoadingCard /> }
);

/**
 * =============================================================================
 * COMPONENT DEFINITIONS
 * =============================================================================
 */

/**
 * Main layout component that includes sidebar and content
 * Receives role information from SecurityGuard
 * NOTE: This component is currently unused but kept for potential future use
 */
const ViewLoanPageWithLayout = ({ 
  props, 
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  return (
    <>
      {/* Show loading if no JWT token */}
      {typeof (props?.jwt) === "undefined" ? (
        <LoadingCard />
      ) : (
        <div className="alert alert-info">
          <strong>ViewLoanPageWithLayout component is not implemented</strong>
        </div>
      )}
    </>
  );
};

/**
 * Content component that shows the ViewLoan component for users with Loan.view or Loan.read permission
 */
const ViewLoanPageContent = ({ 
  props, 
  loanId,
  SingleLoanData,
  RepaymentsData,
  LoanScheduleData,
  LoanJournalEntriesData,
  LoanAuditTrailData,
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.LOAN_CREATE);

  // Show admin/manager view for users with User.create permission
  if (hasUserCreatePermission) {
  return (
    <ViewLoan 
      session={props} 
      permissions={permissions} 
      id={loanId} 
      SingleLoanData={SingleLoanData} 
      RepaymentsData={RepaymentsData} 
      LoanScheduleData={LoanScheduleData} 
      LoanJournalEntriesData={LoanJournalEntriesData}
      LoanAuditTrailData={LoanAuditTrailData}
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
 * ViewLoanPage - View loan page for specific loan
 * Handles data fetching and security checks for Loan.view or Loan.read permission
 */
export default function ViewLoanPage(props) {
  const router = useRouter();
  const { id } = router.query;

  // =============================================================================
  // DATA FETCHING
  // =============================================================================
  
  // Fetch loan data for specific loan
  const SingleLoanData = GetSingleEntity({
    url: URL_SHOW_LOAN,
    id: id,
    jwt: props?.jwt
  });

  // Fetch loan repayments data
  const RepaymentsData = useGetEntity({
    url: URL_GET_LOAN_REPAYMENTS_BY_LOAN_ID + "/" + id,
    jwkToken: props?.jwt
  });

  // Fetch loan schedule data
  const LoanScheduleData = useGetEntity({
    url: URL_GET_LOAN_SCHEDULE + "/" + id,
    jwkToken: props?.jwt
  });

  // Fetch loan journal entries data
  const LoanJournalEntriesData = useGetEntity({
    url: URL_GET_LOAN_JOURNAL_ENTRIES + "/" + id,
    jwkToken: props?.jwt
  });

  // Fetch loan audit trail data
  const LoanAuditTrailData = useGetEntity({
    url: URL_GET_LOAN_AUDIT_TRAIL + "/" + id,
    jwkToken: props?.jwt
  });

  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const hasLoanViewPermission = hasAnyOfPermissions(permissions, PERMISSIONS.LOAN_CREATE);
    
    // Allow access if user has loan view/read permission OR is super user
    return hasLoanViewPermission;
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
    <AppLayout
      session={props}
      permissions={props?.permissions}
      role_name={props?.role_name}
      role_status={props?.role_status}
      role_is_super={props?.role_is_super}
    >
      <PageTitle title="View Loan" />

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
          <ViewLoanPageContent 
            props={props}
            loanId={id}
            SingleLoanData={SingleLoanData}
            RepaymentsData={RepaymentsData}
            LoanScheduleData={LoanScheduleData}
            LoanJournalEntriesData={LoanJournalEntriesData}
            LoanAuditTrailData={LoanAuditTrailData}
            role_name={props?.role_name}
            role_status={props?.role_status}
            role_is_super={props?.role_is_super}
            permissions={props?.permissions}
          />
        </SecurityGuard>
      )}
    </AppLayout>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req })
  return { props: { ...session }}
}
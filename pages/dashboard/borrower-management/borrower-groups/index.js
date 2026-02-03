// Core Components
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import SecurityGuard from "@/components/SecurityGuard"
import LoadingCard from "@/components/LoadingCard"

// View Components
import dynamic from 'next/dynamic';

// Hooks and Services
import { getSession } from 'next-auth/react'

// Configuration
import { PERMISSIONS, hasAnyOfPermissions } from "@/utils/permissionUtils"

// Dynamic import for BorrowerGroups component
const BorrowerGroups = dynamic(
  () => import('@/modules/views/Admin/ManBorrower/Group/index'),
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
 */
const BorrowerGroupsPageWithSidebar = ({ 
  props, 
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {


  return (
    <BorrowerGroupsPageContent 
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
const BorrowerGroupsPageWithLayout = ({ 
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
      <PageTitle title="Borrower Groups" />
      <BorrowerGroupsPageWithSidebar 
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
 * - Admin view: Users with Announcement.create permission
 * - Staff view: Users with role_name 'Staff'
 */
const BorrowerGroupsPageContent = ({ 
  props, 
  role_name,
  role_status,
  role_is_super,
  permissions
}) => {
  // Permission checks
  const hasAnnouncementCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.BORROWER_CREATE);
  const isStaff = role_name === 'Staff';

  // Show admin view for users with Announcement.create permission
  if (hasAnnouncementCreatePermission) {
    return (
      <BorrowerGroups 
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
 * BorrowerGroupsPage - Borrower groups management page
 * Handles data fetching and security checks
 */
export default function BorrowerGroupsPage(props) {
  // =============================================================================
  // SECURITY CHECKER FUNCTION
  // =============================================================================
  
  const customPermissionChecker = (permissions, roleData) => {
    const hasAnnouncementCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.FINANCE_CREATE);
      
      // Allow access if user has create permission OR is staff
      return hasAnnouncementCreatePermission;
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
          <BorrowerGroupsPageWithLayout 
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
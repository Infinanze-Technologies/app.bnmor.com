import dynamic from 'next/dynamic';
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import { getSession } from 'next-auth/react'
import { URL_GET_EMPLOYEE_DOCUMENT, URL_SHOW_EMPLOYEE, URL_SHOW_LOAN } from "@/config/api-paths"
import { useRouter } from "next/router"
import GetSingleEntity from "@/hooks/ReactQuery/GetSingleEntity"
import jwt_decode from "jwt-decode"
import LoadingCard from "@/components/LoadingCard"

const ViewLoanProduct = dynamic(
    () => import('@/modules/views/Admin/ManLoan/LoanProducts/conponents/ViewLoanProduct'),
    { ssr: false, loading: () => <LoadingCard /> }
  );

/**
 * Wrapper component that receives role data and renders AppLayout
 */
const ViewLoanProductPageWithLayout = ({ 
  props,
  decoded,
  role_permz
}) => {
  return (
    <AppLayout
      session={props}
      permissions={props?.permissions}
      role_name={props?.role_name}
      role_status={props?.role_status}
      role_is_super={props?.role_is_super}
    >
      <PageTitle title="View Loan Product" />
      
      {typeof (decoded) == "undefined" ? (
        <>
          <LoadingCard/>
        </>
      ) : (
        <>
          {typeof(role_permz) != "undefined"
           && role_permz.includes("User.create")
             ?
             ( 
              <ViewLoanProduct session={props}  permissions={decoded}/>
             )
             :(
               <>
                <div className="row mt-3 mb-2"><div className="col-12"><div className="alert alert-danger"><strong>Sorry !! You are not permitted to view this Page </strong></div></div></div>
               </>
             )
          }
        </>
      )}
    </AppLayout>
  );
};

export default function ViewLoanProductPage(props) {
  const router = useRouter();
  const { id } = router.query

  let decoded = jwt_decode(props?.jwt);
  let role_permz = decoded?.permissions

  return (
    <>
      <ViewLoanProductPageWithLayout 
        props={props}
        decoded={decoded}
        role_permz={role_permz}
      />
    </>
  )
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req })
  return { props: { ...session }}
}

import dynamic from 'next/dynamic';
import AppLayout from "@/components/DashboardLayout/AppLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import { getSession } from 'next-auth/react'
import { useState } from "react"
import jwt_decode from "jwt-decode"
import LoadingCard from "@/components/LoadingCard"

const AddBorrower = dynamic(
  () => import('@/modules/views/Admin/ManBorrower/Borrower/conponents/AddBorrower'),
  { ssr: false, loading: () => <LoadingCard /> }
);

/**
 * Wrapper component that receives role data and renders AppLayout
 */
const AddBorrowerPageWithLayout = ({ 
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
      <PageTitle title="Add Borrower" />
      
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
              <AddBorrower session={props} permissions={decoded} />
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

export default function AddBorrowerPage(props) {
  let decoded = jwt_decode(props?.jwt);
  let role_permz = decoded?.permissions

  return (
    <>
      <AddBorrowerPageWithLayout 
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

import React from 'react'
import {URL_GET_TIMESHEET, URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES, URL_GET_ACCOUNTLIST } from "@/config/api-paths";
import AccountListTable from './components/AccountListTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AccountListDataObject = useFetchQuery({
    url: URL_GET_ACCOUNTLIST,
    jwt: jwt,
    tableKey  : "AccountList",
    filter : ''

  })


  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey  : "QryBranch",

  })

  





  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<AccountListTable jwt={jwt} AccountListDataObject={AccountListDataObject } QryBranchDataObject={QryBranchDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index
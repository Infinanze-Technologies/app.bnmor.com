import React from 'react'
import {URL_GET_TIMESHEET, URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES, URL_GET_ACCOUNTLIST, URL_GET_PAYEE } from "@/config/api-paths";
import PayeesTable from './components/PayeesTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const PayeeDataObject = useFetchQuery({
    url: URL_GET_PAYEE,
    jwt: jwt,
    tableKey  : "Payee",
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
<PayeesTable jwt={jwt} PayeeDataObject={PayeeDataObject } QryBranchDataObject={QryBranchDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index
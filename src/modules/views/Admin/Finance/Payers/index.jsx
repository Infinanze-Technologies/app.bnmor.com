import React from 'react'
import {URL_GET_Qry_BRANCH, URL_GET_PAYER } from "@/config/api-paths";
import PayerTable from './components/PayerTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const PayerDataObject = useFetchQuery({
    url: URL_GET_PAYER,
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
<PayerTable jwt={jwt} PayerDataObject={PayerDataObject} QryBranchDataObject={QryBranchDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index
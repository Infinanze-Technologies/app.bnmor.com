import React from 'react'
import {URL_GET_TIMESHEET, URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES, URL_GET_ACCOUNTLIST, URL_ACCOUNT_BALANCE } from "@/config/api-paths";
import AccountBalanceTable from './components/AccountBalanceTable';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';
import useCustomDataQuery from '@/hooks/ReactQuery/useCustomDataQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AccountBalanceDataObject = useCustomDataQuery({
    url: URL_ACCOUNT_BALANCE,
    jwt: jwt,
    tableKey  : "AccountBalance",
    filter : ''

  })

  // console.log('====================================');
  // console.log(AccountBalanceDataObject);
  // console.log('====================================');


  





  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<AccountBalanceTable jwt={jwt} AccountBalanceDataObject={AccountBalanceDataObject }/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index
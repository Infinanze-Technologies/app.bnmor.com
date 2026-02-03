import React from 'react'
import {URL_GET_TIMESHEET, URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES, URL_GET_ACCOUNTLIST, URL_GET_QRY_ATTRIBUTE, URL_GET_DEPOSIT, URL_GET_COA_FOR_LOANS, URL_GET_CASH_FUNDING_ACCOUNTS } from "@/config/api-paths";
import DepositTable from './components/DepositTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AccountDepositDataObject = useFetchQuery({
    url: URL_GET_DEPOSIT,
    jwt: jwt,
    tableKey  : "AccountDeposit",
    filter : ''

  })


  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey  : "QryBranch",

  })

  const AttributesDataObject = useSelectQuery({
    url: URL_GET_QRY_ATTRIBUTE,
    jwt: jwt,
    tableKey  : "QryIncomeType",
    filter : '?attribute_type=Income Type'

  })


  const PaymentTypeAttributesDataObject = useSelectQuery({
    url: URL_GET_QRY_ATTRIBUTE,
    jwt: jwt,
    tableKey  : "QryPaymentType",
    filter : '?attribute_type=Payment Type'

  })
  

  const CoaForDepositsData = useSelectQuery({
    url: URL_GET_CASH_FUNDING_ACCOUNTS,
    jwt: jwt,
    tableKey: "CoaForDeposits",
    filter : ''
  });
  






  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<DepositTable jwt={jwt} AccountDepositDataObject={AccountDepositDataObject } QryBranchDataObject={QryBranchDataObject} AttributesDataObject={AttributesDataObject} PaymentTypeAttributesDataObject={PaymentTypeAttributesDataObject} CoaForDepositsData={CoaForDepositsData}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index
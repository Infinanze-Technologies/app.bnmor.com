import React from 'react'
import {URL_GET_TIMESHEET, URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES, URL_GET_ACCOUNTLIST, URL_GET_QRY_ATTRIBUTE, URL_GET_DEPOSIT, URL_GET_BANK_TRANSFER } from "@/config/api-paths";
import DepositTable from './components/BankTransferTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AccountTransferDataObject = useFetchQuery({
    url: URL_GET_BANK_TRANSFER,
    jwt: jwt,
    tableKey  : "AccountTransfer",
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

  






  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<DepositTable jwt={jwt} AccountTransferDataObject={AccountTransferDataObject } QryBranchDataObject={QryBranchDataObject} AttributesDataObject={AttributesDataObject} PaymentTypeAttributesDataObject={PaymentTypeAttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index
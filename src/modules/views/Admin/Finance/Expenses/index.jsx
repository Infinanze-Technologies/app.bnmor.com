import React from 'react'
import {URL_GET_TIMESHEET, URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES, URL_GET_ACCOUNTLIST, URL_GET_QRY_ATTRIBUTE, URL_GET_DEPOSIT, URL_GET_EXPENSES, URL_GET_CASH_FUNDING_ACCOUNTS } from "@/config/api-paths";
import DepositTable from './components/ExpensesTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AccountExpenseDataObject = useFetchQuery({
    url: URL_GET_EXPENSES,
    jwt: jwt,
    tableKey  : "AccountExpenses",
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
    tableKey  : "QryExpenseType",
    filter : '?attribute_type=Expense Type'

  })


  const PaymentTypeAttributesDataObject = useSelectQuery({
    url: URL_GET_QRY_ATTRIBUTE,
    jwt: jwt,
    tableKey  : "QryPaymentType",
    filter : '?attribute_type=Payment Type'

  })

  const CoaForExpensesData = useSelectQuery({
    url: URL_GET_CASH_FUNDING_ACCOUNTS,
    jwt: jwt,
    tableKey: "CoaForExpenses",
    filter : ''
  });
  






  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<DepositTable jwt={jwt} AccountExpenseDataObject={AccountExpenseDataObject } QryBranchDataObject={QryBranchDataObject} AttributesDataObject={AttributesDataObject} PaymentTypeAttributesDataObject={PaymentTypeAttributesDataObject} CoaForExpensesData={CoaForExpensesData}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index
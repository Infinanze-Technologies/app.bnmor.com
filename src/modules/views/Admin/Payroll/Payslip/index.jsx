import React from 'react'
import  { useState } from 'react'
import {Button } from 'antd'
import {URL_GET_EMPLOYEES,URL_GET_ACTIVE_ROLES, URL_GET_PAYSLIP, URL_GET_CASH_FUNDING_ACCOUNTS } from "@/config/api-paths";
import PayslipTable from './conponents/PayslipTable';
import useGetEntity from '@/hooks/useGetEntity';
import UsersData from "@/components/json/users.json"
import GeneratePayslipOption from './conponents/GeneratePayslipOption';
import GenerateBulkPaymentOption from './conponents/GenerateBulkPaymentOption';
import { ADD_EMPLOYEE_PAGE } from '@/config/page-routes';
import Link from 'next/link';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {
  const [paySlipmonths, setPaySlipMonths] = useState(null);
  const [paySlipyears, setPaySlipYears] = useState(null);
  const [paymentmonths, setPaymentMonths] = useState(null);
  const [paymentyears, setPaymentYears] = useState(null);
  const [search, setSearch] = useState('')

  let jwt = props?.session?.jwt;
  let current_year = new Date().getFullYear();
  let filter = `?search=${search}&month=${paymentmonths == null ? 'January' : paymentmonths}&year=${paymentyears == null ? current_year : paymentyears}`
  const StaffDataObject = usePaginateQuery({
    url: URL_GET_PAYSLIP,
    jwt: jwt,
    tableKey : "Payslip",
    filter : filter
  })

  


  const CoaForPayslipData = useSelectQuery({
    url: URL_GET_CASH_FUNDING_ACCOUNTS,
    jwt: jwt,
    tableKey: "CoaForPayslip",
    filter : ''
  });




  return (
    <>
    <div>
   



{/* <div className="filter-row">
  
 
<GeneratePayslipOption
jwt={jwt}
StaffDataObject = {StaffDataObject}
  paySlipmonths={paySlipmonths}
setPaySlipMonths={setPaySlipMonths} paySlipyears={paySlipyears} setPaySlipYears={setPaySlipYears}
paymentmonths={paymentmonths} setPaymentMonths={setPaymentMonths} paymentyears={paymentyears} setPaymentYears={setPaymentYears}
/>



</div> */}




<div className="row">
<div className="col-md-12 d-flex">
<PayslipTable StaffDataObject={StaffDataObject} jwt={jwt} UsersData={UsersData} 
setSearch={setSearch}
paySlipmonths={paySlipmonths}
setPaySlipMonths={setPaySlipMonths} paySlipyears={paySlipyears} setPaySlipYears={setPaySlipYears}
paymentmonths={paymentmonths} setPaymentMonths={setPaymentMonths} paymentyears={paymentyears} setPaymentYears={setPaymentYears}
CoaForPayslipData={CoaForPayslipData}
/>
</div>
  </div>
  
</div>






    </>
  )
}

export default index
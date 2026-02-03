import React from 'react'
import  { useState } from 'react'
import {Button } from 'antd'
import {URL_GET_EMPLOYEES,URL_GET_ACTIVE_ROLES, URL_GET_EMP_PAYSLIP } from "@/config/api-paths";
import PayslipTable from './conponents/PayslipTable';
import useGetEntity from '@/hooks/useGetEntity';
import UsersData from "@/components/json/users.json"
import GeneratePayslipOption from './conponents/GeneratePayslipOption';

import usePaginateQuery from '@/hooks/ReactQuery/usePagination';

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
    url: URL_GET_EMP_PAYSLIP,
    jwt: jwt,
    tableKey : "Payslip",
    filter : filter
  })

  







  return (
    <>
    <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      {/* <h3 className="page-title">Admin Page</h3> */}
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Manage</a>
        </li>
        <li className="breadcrumb-item active">PaySlip</li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    {/* <div className='submit-button'>
    <Button
    shape='round'
    >
    <Link href={ADD_EMPLOYEE_PAGE}
    className='href-tag'
    > 
    Create  Staff
    </Link>
    </Button>
    
    </div> */}
   
    </div>
  </div>
</div>




<div className="row filter-row">
  
 
<GeneratePayslipOption
jwt={jwt}
StaffDataObject = {StaffDataObject}
  paySlipmonths={paySlipmonths}
setPaySlipMonths={setPaySlipMonths} paySlipyears={paySlipyears} setPaySlipYears={setPaySlipYears}
paymentmonths={paymentmonths} setPaymentMonths={setPaymentMonths} paymentyears={paymentyears} setPaymentYears={setPaymentYears}
/>



</div>




<div className="row">
  <div className="col-md-12">
  <div className="row">
<PayslipTable StaffDataObject={StaffDataObject} jwt={jwt} UsersData={UsersData} 
setSearch={setSearch}
paySlipmonths={paySlipmonths}
setPaySlipMonths={setPaySlipMonths} paySlipyears={paySlipyears} setPaySlipYears={setPaySlipYears}
paymentmonths={paymentmonths} setPaymentMonths={setPaymentMonths} paymentyears={paymentyears} setPaymentYears={setPaymentYears}

/>
</div>
  </div>
  
</div>



            </div>



    </>
  )
}

export default index
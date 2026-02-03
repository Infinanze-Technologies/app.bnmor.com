import React from 'react'
import  { useState } from 'react'
import {Button } from 'antd'
import {URL_GET_EMPLOYEES,URL_GET_ACTIVE_ROLES } from "@/config/api-paths";
import StaffTable from './conponents/StaffTable';
import useGetEntity from '@/hooks/useGetEntity';
import UsersData from "@/components/json/users.json"
import { ADD_EMPLOYEE_PAGE } from '@/config/page-routes';
import Link from 'next/link';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
const index = (props) => {


  let jwt = props?.session?.jwt;

  const StaffDataObject = usePaginateQuery({
    url: URL_GET_EMPLOYEES,
    jwt: jwt,
    tableKey : "Employees",
    filter : ``
  })

  







  return (
    <>
    <div>
  





<div className="row">
  <div className="col-md-12 d-flex">
<StaffTable StaffDataObject={StaffDataObject} jwt={jwt} UsersData={UsersData}/>
  </div>
  
</div>



            </div>



    </>
  )
}

export default index
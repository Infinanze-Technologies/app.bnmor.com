import React from 'react'
import {URL_GET_TIMESHEET, URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES, URL_GET_QRY_ATTRIBUTE, URL_GET_LEAVE } from "@/config/api-paths";
import LeaveTable from './components/LeaveTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const LeavetDataObject = usePaginateQuery({
    url: URL_GET_LEAVE,
    jwt: jwt,
    tableKey  : "Leave",
    filter : ''

  })


  const QryEmployeeDataObject = useSelectQuery({
    url: URL_QRY_EMPLOYEES,
    jwt: jwt,
    tableKey  : "QryEmployee",
    filter : ''

  })

  const AttributesDataObject = useSelectQuery({
    url: URL_GET_QRY_ATTRIBUTE,
    jwt: jwt,
    tableKey  : "QryLeaveType",
    filter : '?attribute_type=Leave Type'

  })

  // URL_GET_QRY_ATTRIBUTE





  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<LeaveTable jwt={jwt} LeavetDataObject={LeavetDataObject } QryEmployeeDataObject={QryEmployeeDataObject} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index
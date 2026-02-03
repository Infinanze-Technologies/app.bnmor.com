import React from 'react'
import {URL_GET_TIMESHEET, URL_GET_Qry_BRANCH, URL_QRY_EMPLOYEES, URL_GET_QRY_ATTRIBUTE, URL_GET_LEAVE, URL_GET_HOLIDAY, URL_GET_EMP_HOLIDAY } from "@/config/api-paths";
import HolidayTable from './components/HolidayTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;
  let employee_id = props?.session?.user?.employee_id

  const HolidayDataObject = useFetchQuery({
    url: URL_GET_EMP_HOLIDAY,
    jwt: jwt,
    tableKey  : "Holiday",
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
<HolidayTable jwt={jwt} HolidayDataObject={HolidayDataObject } QryEmployeeDataObject={QryEmployeeDataObject} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index